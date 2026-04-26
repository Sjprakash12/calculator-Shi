function[shading]=shadingeff(mn,a,n,width,h)

% Incident angle%

% a=60;

%Radius of curvature of the mirror

 r=70000;

%Mirror number

% mn=1;

% cavity width

% cw=0.5;

% Number of mirrors%

% n=8;

%width of the mirror

% width=1.828;

% Gap between the mirrors%

g=0.06;

%height of reciever from the mirror

% h=12;

% number of rays mirrors i%

w=linspace(width/10000,width,5000);

%depth of the mirror

for i=1:length(w)
    
depth(i)=r-sqrt(r^2-(w(i)/2)^2);

%angle between the normal


angle(i)=atan((w(i)/2)/(r-depth(i)))*180/pi();

d=[-2.155 -1.9428 -1.7326 -1.5242 -1.3173 -1.1118 -0.9075 -0.7043 -0.5021 -0.3007 -0.1 0.1 0.3007 0.5021 0.7043 0.9075 1.1118 1.373 1.5242 1.7326 1.9428 2.155];

% d(1)=(g+width)/2+(n/2-1)*(g+width);
radius(1)=2*sqrt(abs(d(1))^2+h^2);

hit(i)=h;

end

% mirror distance

for i=2:n
    
%     d(i)=d(i-1)-g-width;
    radius(i)=2*sqrt(abs(d(i))^2+h^2);
    
end

dist=abs(d);

d=abs(d);

d=d(mn);

if mn<=n-1

% angle of tilt and cosine eff

for i=1:n

if i<=n/2
       
    m(i)=(a+90-atan(h/dist(i))*180/pi())/2;

else

    m(i)=(a-90+atan(h/dist(i))*180/pi())/2;  
  
end
end

        
    l=(width*sin(m(mn+1)*pi()/180)*tan(a*pi()/180));
    
    A=cod(mn,r,n,width,a,h);
    
    B=cod(mn+1,r,n,width,a,h);
    
    syms x y
    
    A1=(x-A(1,1))/(A(2,1)-A(1,1))-((y-A(1,2))/(A(2,2)-A(1,2)));

   
    B1=(x-B(1,1))/(-l)-(y-B(1,2))/(B(2,2)-B(1,2));
   

C1=solve(A1,B1);

C=double(C1.x);



if mn<=n/2
       
    m=(a+90-atan(h/d)*180/pi())/2;

else

    m=(a-90+atan(h/d)*180/pi())/2;  
  
end

          
%Mirror distance from the center for left and right end 



 if mn<=n/2

for i=1:length(w)
    
               
      if (m +angle(i))>=0
          
     
          distancel(i)=d+sqrt(depth(i)^2+(w(i)/2)^2)*cos((abs(m)+atan(depth(i)*2/w(i))*180/pi())*pi()/180);
         
           
      else
      
          distancel(i)= d+sqrt(depth(i)^2+(w(i)/2)^2)*cos((abs(m)-atan(depth(i)*2/w(i))*180/pi())*pi()/180);
      
     
      end

      if (m-angle(i))>=0
                    
          
          distancer(i)=d-sqrt(depth(i)^2+(w(i)/2)^2)*cos((abs(m)-atan(depth(i)*2/w(i))*180/pi())*pi()/180);;
      
      else
      
      
          distancer(i)= d-sqrt(depth(i)^2+(w(i)/2)^2)*cos((abs(m)+atan(depth(i)*2/w(i))*180/pi())*pi()/180);
      
     
      end
end
            
    else
                  
%Mirror distance from the center for left and right end 

           for i=1:length(w)
               
      if (m +angle(i))>=0
          
     
         distancel(i)=d-sqrt(depth(i)^2+(w(i)/2)^2)*cos((abs(m)+atan(depth(i)*2/w(i))*180/pi())*pi()/180);
         
           
      else
      
          distancel(i)= d-sqrt(depth(i)^2+(w(i)/2)^2)*cos((abs(m)-atan(depth(i)*2/w(i))*180/pi())*pi()/180);
      
     
      end

      if (m-angle(i))>=0
          
     
          
          
      distancer(i)=d+sqrt(depth(i)^2+(w(i)/2)^2)*cos((abs(m)-atan(depth(i)*2/w(i))*180/pi())*pi()/180);;
      
      else
      
      
      distancer(i)= d+sqrt(depth(i)^2+(w(i)/2)^2)*cos((abs(m)+atan(depth(i)*2/w(i))*180/pi())*pi()/180);
      
     
      end
              
    end
    
 end


 
if mn<=n/2
 for i=1:length(w)
     
     if abs(distancel(i))>=abs(C)
        
         count2=i;
         
         break;
     end
 end
  for i=1:length(w)
     
     if abs(distancer(i))<=abs(C)
        
         count1=i;
         
         break;
         
         
     end
 end
else
    for i=1:length(w)
     
     if abs(distancel(i))<=abs(C)
        
         count2=i;
         
         break;
     end
    end
     for i=1:length(w)
     
     if abs(distancer(i))>=abs(C)
        
         count1=i;
         
         break;
         
         
     end
 end
end
if mn<=n/2
    
 if abs(A(2,1))>=abs(C)
     
     count1=length(w);
 end
else
    if abs(A(2,1))<=abs(C)
     
     count1=length(w);
 end
end
if mn==n/2
    
for i=1:length(w)
     
     if abs(distancer(i))<=abs(C)
        
         count1=i;
         
         break;
         
         
     end
 end
end
    
  if mn==n/2 && C >=-(g/2)
     count1=length(w);
     count2=1;
  end
 
       distancel=distancel(count2:length(w));
       

       distancer=distancer(1:count1);
       

  

    
 
 if mn<=(n/2)
 
 if d<abs(C)
      distancer=[];
      
 end
 else
      if d>abs(C)
      distancer=[];
       
      end
 end
 
 

if mn<=n/2
if length(distancer)==0
    
shading=(length(distancel))/length(w)/2;


else
    
shading=(length(distancel)+length(distancer))/length(w)/2;
    end
else
    
    if length(distancel)==0
    
shading=length(distancer)/length(w)/2;
else
    
shading=(length(distancel)+ length(distancer))/length(w)/2;

    end
%set(p,'color','black');
 
end
else
    
   

shading=1;
end



 
