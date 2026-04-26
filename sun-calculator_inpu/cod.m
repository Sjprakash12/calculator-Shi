function[Co]=cod(mn,r,n,width,a,h)

w=width;

%depth of the mirror

depth=r-sqrt(r^2-(w/2)^2);

%angle between the normal

angle=atan((w/2)/(r-depth))*180/pi();

% Incident angle%


% d(1)=(g+w)/2*(n-1);
% 
% % mirror distance
% 
% for i=2:n
%     
%     d(i)=d(i-1)-g-w;
%     
% end

d=[-2.155 -1.9428 -1.7326 -1.5242 -1.3173 -1.1118 -0.9075 -0.7043 -0.5021 -0.3007 -0.1 0.1 0.3007 0.5021 0.7043 0.9075 1.1118 1.373 1.5242 1.7326 1.9428 2.155];
d=abs(d);

% angle of tilt and cosine eff

d=d(mn);

    
    if mn<=n/2
        
      m=(a+90-atan(h/d)*180/pi())/2;
      
      
%Mirror distance from the center for left and right end 
            
      if (m+angle)>=0
   
     
         distancel=-(d+sqrt(depth^2+(w/2)^2)*cos((abs(m)+atan(depth*2/w)*180/pi())*pi()/180));
      
     
      
      else
      
         distancel= -(d+sqrt(depth^2+(w/2)^2)*cos((abs(m)-atan(depth*2/w)*180/pi())*pi()/180));
      

      
     
      end
      
      if (m-angle)>=0
          
     
           
          distancer=-(d-sqrt(depth^2+(w/2)^2)*cos((abs(m)-atan(depth*2/w)*180/pi())*pi()/180));
      
      
      else
          
          
                 
          distancer=-( d-sqrt(depth^2+(w/2)^2)*cos((abs(m)+atan(depth*2/w)*180/pi())*pi()/180));
      
     
      end
            
         
    

    else
        
      m=(a-90+atan(h/d)*180/pi())/2;
      
      
        
                  
%Mirror distance from the center for left and right end 

           
      if (m+angle)>=0
     
      
          distancel=d-sqrt(depth^2+(w/2)^2)*cos((abs(m)+atan(depth*2/w)*180/pi())*pi()/180);
      
              
      
      else
          
          
          distancel=d-sqrt(depth^2+(w/2)^2)*cos((abs(m)-atan(depth*2/w)*180/pi())*pi()/180);
            
      
     
      end 
      
        if (m-angle)>=0
     
               
     
            distancer=d+sqrt(depth^2+(w/2)^2)*cos((abs(m)-atan(depth*2/w)*180/pi())*pi()/180);
      
            
        else
            
            
            
            distancer=d+sqrt(depth^2+(w/2)^2)*cos((abs(m)+atan(depth*2/w)*180/pi())*pi()/180);
     
      end  
              
    end
      
 
      
          
      if (m-angle)>=0
               
     
      
          heightr=-(sqrt(depth^2+(w/2)^2)*sin((abs(m)-atan(depth*2/w)*180/pi())*pi()/180));
      
      else
          
          
          heightr=sqrt(depth^2+(w/2)^2)*sin((abs(m)+atan(depth*2/w)*180/pi())*pi()/180);
      
      end
      
    %reciever height from the mirror end point for left side
    
      if (m-angle)>=0
      
      
          heightl=sqrt(depth^2+(w/2)^2)*sin((abs(m)+atan(depth*2/w)*180/pi())*pi()/180);
      
      else
          
          
          
          heightl=-(sqrt(depth^2+(w/2)^2)*sin((abs(m)-atan(depth*2/w)*180/pi())*pi()/180));
     
      end
      
      
      
      A=[distancel heightl];
B=[distancer heightr];

Co=[A;B];
