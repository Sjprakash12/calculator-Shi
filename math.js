/**
 * LFR Simulation Logic - JavaScript Implementation
 */

export class LFRSimulator {
    constructor(nMirrors = 22, width = 0.195, height = 2.5) {
        this.n = nMirrors;
        this.width = width;
        this.h = height;
        this.dArray = [-2.155, -1.9428, -1.7326, -1.5242, -1.3173, -1.1118, -0.9075, 
                       -0.7043, -0.5021, -0.3007, -0.1, 0.1, 0.3007, 0.5021, 
                       0.7043, 0.9075, 1.1118, 1.373, 1.5242, 1.7326, 1.9428, 2.155];
    }

    getCosineEfficiency(angleDeg) {
        let sumCos = 0;
        const aRad = (angleDeg * Math.PI) / 180;

        for (let i = 0; i < this.n; i++) {
            const d = Math.abs(this.dArray[i]);
            let m;
            if (i + 1 <= this.n / 2) {
                m = (angleDeg + 90 - (Math.atan(this.h / d) * 180) / Math.PI) / 2;
            } else {
                m = (angleDeg - 90 + (Math.atan(this.h / d) * 180) / Math.PI) / 2;
            }
            sumCos += Math.cos(aRad - (m * Math.PI) / 180);
        }
        return sumCos / this.n;
    }

    getShadingEfficiency(mn, a) {
        if (mn >= this.n) return 1.0;

        const r = 70000;
        const w = this.width;
        const h = this.h;
        const d_vals = this.dArray;
        const g = 0.06;

        // 1. Get Coordinates for Mirror mn and mn+1
        const A = this.getMirrorCoords(mn, a);
        const B = this.getMirrorCoords(mn + 1, a);

        // 2. Shadow length
        const m_next = mn + 1 <= this.n / 2 ? 
            (a + 90 - (Math.atan(h / Math.abs(d_vals[mn])) * 180) / Math.PI) / 2 :
            (a - 90 + (Math.atan(h / Math.abs(d_vals[mn])) * 180) / Math.PI) / 2;
        const l = w * Math.sin((m_next * Math.PI) / 180) * Math.tan((a * Math.PI) / 180);

        // 3. Intersection of Shadow Line and Mirror Line
        // Line A: through A1, A2
        // Line B: from B1 with shadow angle
        const B2 = [B[0][0] - l, B[0][1]]; // Approximate shadow projection
        
        const intersection = this.intersectLines(A[0], A[1], B[0], B2);
        if (!intersection) return 1.0;

        const C = intersection.x;

        // 4. Shading Calculation (Simplified replication of shadingeff.m logic)
        // This calculates the percentage of the mirror that is NOT shaded
        const distancel = Math.abs(A[0][0]);
        const distancer = Math.abs(A[1][0]);
        const C_abs = Math.abs(C);

        if (mn <= this.n / 2) {
            if (C_abs < distancel && C_abs > distancer) {
                return (distancel - C_abs) / (distancel - distancer);
            }
        } else {
            if (C_abs > distancel && C_abs < distancer) {
                return (C_abs - distancel) / (distancer - distancel);
            }
        }

        return 0.98; // Default minor losses
    }

    getMirrorCoords(mn, a) {
        const d = Math.abs(this.dArray[mn-1]);
        const r = 70000;
        const w = this.width;
        const h = this.h;
        
        const depth = r - Math.sqrt(r**2 - (w/2)**2);
        const angle = (Math.atan((w/2) / (r-depth)) * 180) / Math.PI;
        
        let m = mn <= this.n/2 ? (a+90 - (Math.atan(h/d)*180)/Math.PI)/2 : (a-90 + (Math.atan(h/d)*180)/Math.PI)/2;
        const m_rad = (m * Math.PI) / 180;
        const hyp = Math.sqrt(depth**2 + (w/2)**2);
        const d_angle = (Math.atan(depth*2/w) * 180) / Math.PI;

        let distL, distR, heightL, heightR;
        if (mn <= this.n/2) {
            distL = -(d + hyp * Math.cos(((Math.abs(m) + d_angle) * Math.PI) / 180));
            distR = -(d - hyp * Math.cos(((Math.abs(m) - d_angle) * Math.PI) / 180));
            heightL = hyp * Math.sin(((Math.abs(m) + d_angle) * Math.PI) / 180);
            heightR = -hyp * Math.sin(((Math.abs(m) - d_angle) * Math.PI) / 180);
        } else {
            distL = d - hyp * Math.cos(((Math.abs(m) + d_angle) * Math.PI) / 180);
            distR = d + hyp * Math.cos(((Math.abs(m) - d_angle) * Math.PI) / 180);
            heightL = hyp * Math.sin(((Math.abs(m) + d_angle) * Math.PI) / 180);
            heightR = -hyp * Math.sin(((Math.abs(m) - d_angle) * Math.PI) / 180);
        }
        return [[distL, heightL], [distR, heightR]];
    }

    intersectLines(p1, p2, p3, p4) {
        const x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1];
        const x3 = p3[0], y3 = p3[1], x4 = p4[0], y4 = p4[1];
        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denom === 0) return null;
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) };
    }

    getRayData(angleDeg) {
        const aRad = (angleDeg * Math.PI) / 180;
        const sunVec = [Math.sin(aRad), -Math.cos(aRad)];
        
        const mirrors = [];
        for (let i = 0; i < this.n; i++) {
            const d = this.dArray[i];
            let m;
            if (i + 1 <= this.n / 2) {
                m = (angleDeg + 90 - (Math.atan(this.h / Math.abs(d)) * 180) / Math.PI) / 2;
            } else {
                m = (angleDeg - 90 + (Math.atan(this.h / Math.abs(d)) * 180) / Math.PI) / 2;
            }
            
            const mRad = (m * Math.PI) / 180;
            const normal = [-Math.sin(mRad), Math.cos(mRad)];
            
            // Reflection
            const dot = sunVec[0] * normal[0] + sunVec[1] * normal[1];
            const reflVec = [
                sunVec[0] - 2 * dot * normal[0],
                sunVec[1] - 2 * dot * normal[1]
            ];
            
            mirrors.push({
                x: d,
                y: 0,
                tilt: m,
                reflVec: reflVec
            });
        }
        return { sunVec, mirrors };
    }
}
