%  function[ ]=efficiency2025(a)
clc;

clear;


% lat=-28.1077865;
% 
% long=140.203521;

lat=6;
% 
long=73.45;

tz=5;



% tz=10.5;

date =(42005:42369);



for i=1:length(date)

    azi(i)=azimuthangle(lat,long,solarnoon(lat,long,tz,date(i)),tz,date(i))
    
    if 175<azi(i)<185
        
        
        trackangle(i)=-90+elevationangle(lat,long,solarnoon(lat,long,tz,date(i)),tz,date(i))+lat;
        
    else
        trackangle(i)=90-elevationangle(lat,long,solarnoon(lat,long,tz,date(i)),tz,date(i))+lat;
    
    end

end

t=linspace(6,20,57);

% dni=xlsread('data1'); 
% 
% j=1;
% 
% for i=1:365
%     
%        temp(:,i)=dni(j:j+85);
%         
%         j=i*144+1;
% end  
% 
% temp=temp';

for i=1:length(date)

        for j=1:length(t)
    
    if t(j)>solarnoon(lat,long,tz,date(i))
      
        t1(i,j)=2*solarnoon(lat,long,tz,date(i))-t(j);
        
%         a(i,j)=incidentangle(lat,long,t1(i,j),tz,date(i));

pveff(i,j)=elevationangle(trackangle(i),long,t1(i,j),tz,date(i));
        
    
    else
        
        t1(i,j)=t(j);
        
%         a(i,j)=incidentangle(lat,long,t1(i,j),tz,date(i));

pveff(i,j)=elevationangle(trackangle(i),long,t1(i,j),tz,date(i));
        
    
    end
    
    end
% 
end
% 
% for i=1:365
%     
%     cseff(i)=cos((90-elevationangle(lat,long,solarnoon(lat,long,tz,date(i)),tz,date(i)))*pi()/180);
%     
% end
% 
% 
% for i=1:365
%     
%     for j=1:length(t)
%         
%         if a(i,j)<90
% 
%             eff(i,j)=cosineefficiency2025(a(i,j))*cseff(i);
%             
% %          
%         else
%              eff(i,j)=0;
%             
%         end
%        
% 
%     end
% end
% 
% for i=1:365
%     
% 
%     for j=1:length(t)
% 
%         if a(i,j)<90
% 
%               shadingeff(i,j)=shadingefficiency2025(a(i,j));
%         
%         else
%               shadingeff(i,j)=0;
%             
%         end
%            
%     end
% end
% % 
