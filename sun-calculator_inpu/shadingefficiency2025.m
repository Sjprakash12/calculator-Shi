function[shadingefficiency ]=shadingefficiency2025(a)
% a=45;
% clc;
% % 
% clear;
% % 

% R=[24 22 19 18 17 17 17 17 18 19 22 24]; FOR NUMBER OF MIRRORS12
 
% R=[15 13 11 11 11 11 13 15]; FOR NUMBER OF MIRRORS8



% t=[8 9 10 11 12 13 14 15 16 17 18];

% tz=10.5;

% % date=[45792];
% 
  
% % 
% for i=1:length(data)
%     
%     if data(i,3)>7 && data(i,3)<19
%         
%         t(i)=data(i,3);
%         
%         dni(i)=data(i,4);
%     else
%         t(i)=0;
%         dni(i)=0;
%     end
% end

% % 
% % data=xlswrite
% date =(43831:44195);
% % 
% % dni=data(:,4);
% % 
% % 
% %   xlswrite('time.xls',t );
% %   xlswrite('dni2025.xls',dni);
%   
%   
% for i=1:length(date)
% 
%         
% 
%     for j=1:length(t)
%     
%     if t(j)>solarnoon(lat,long,date(i))
%       
%         t1(i,j)=2*solarnoon(lat,long,date(i))-t(j);
%         
%         a(i,j)=incidentangle(lat,long,t1(i,j),tz,date(i));
%     
%     else
%         
%         t1(i,j)=t(j);
%         
%         a(i,j)=incidentangle(lat,long,t1(i,j),tz,date(i));
%     
%     end
%     
% end
% 
% end
% 
% 
% 
% a=a';
% 
% 
% % 
% % for i=1:length(date)
% %     
% %     inc(1+(i-1)*9:9+(i-1)*9,1)=a(1:9,i);
% %     
% %     tdni(1+(i-1)*9:9+(i-1)*9,1)=dni(1:9,i);
% % 
% % end
% % 
% % a=inc;
% 
% % dni=tdni;
% 
% n=22;
% 
% a=a(1,1);
% 
% % for i=1:length(date)

n=22;
h=2.5;

% d=[-2.155 -1.9428 -1.7326 -1.5242 -1.3173 -1.1118 -0.9075 -0.7043 -0.5021 -0.3007 -0.1 0.1 0.3007 0.5021 0.7043 0.9075 1.1118 1.373 1.5242 1.7326 1.9428 2.155];
% 
% d=abs(d);

w=0.195;

% a=45;

i=1;

 for i=1:n

        
    
      
seff(i)= shadingeff( i,a,n,w,h);
     
            
      
    
                
 end

shadingefficiency=sum(seff)/n;
