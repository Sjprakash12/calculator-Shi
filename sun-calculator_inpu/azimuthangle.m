
function[saza]=azimuthangle(lat,long,t,tz,date)


% 
% lat=-28.1077865;
% 
% long=140.203521;
% 
% tz=10.5;
% 
% 
% 
% 
% date=42005;
% 
% t=solarnoon(lat,long,tz,date);
% 
time = t*10*0.1/24;

% tz=5.5;

jd= date+ 2415018.5 + time - (tz / 24);

jc =(jd-2451545)/36525;

gmls = mod((280.46646 + (jc * (36000.76983 + (jc * 0.0003032)))),360);

gmas = 357.52911+ (jc * (35999.05029 - (0.0001537* jc)));

eeo = 0.016708634 - (jc *(0.000042037 + (0.0001537*jc)));


eqctr = sin(gmas*(pi/180))*(1.914602- jc*(0.004817+0.000014*jc))+sin(((2*gmas)*(pi/180)))*(0.019993-0.000101*jc)+sin((3*gmas)*(pi/180))*0.000289;

stl = eqctr+gmls;

sta = eqctr+gmas;

srv =(1.000001018*(1-eeo*eeo))/(1+eeo* cos((sta* pi/180)));

sal = stl - 0.00569 - 0.00478 * sin((125.04-1934.136*jc)* pi / 180);

moe = 23+(26+((21.448-jc*(46.815+ jc*(0.00059-jc*0.001813))))/60)/60;

oc = moe + 0.00256 * cos((125.04-1934.136*jc)*pi/180);

sra = 180-atan(cos(sal*pi/180)/(cos(oc*pi/180)* sin(sal* pi/180)))*(180/pi);

sd = (asin(sin((oc)*pi/180)* sin((sal)*pi/180)))*(180/pi);

vary = tan((oc/2)*pi/180)* tan((oc/2)*pi/180);

eqoft=4*180/pi()*(vary*sin(2*pi()/180*(gmls))-2*eeo*sin(pi()/180*(gmas))+4*eeo*vary*sin(pi()/180*(gmas))*cos(2*pi()/180*(gmls))-0.5*vary*vary*sin(4*pi()/180*(gmls))-1.25*eeo*eeo*sin(2*pi()/180*(gmas)));

has = (acos(cos((90.833)*pi/180)/(cos((lat)*pi/180)* cos((sd)*pi/180))- tan((lat)*pi/180)* tan((sd)*pi/180)))*(180/pi);

sn = (720-4*long- eqoft + tz *60)/1440;

srt = sn - has * 4 / 1440;

sst = sn + has * 4 / 1440;

sld = 8 * has;


tst = mod(time * 1440 + eqoft + 4 * long - 60 * tz ,1440);

    if (tst / 4 < 0);
    
      ha = tst / 4 + 180;

    else
      ha = tst / 4 -180;

    end
    
 sza = (acos(sin((lat)*pi/180)* sin((sd)*pi/180)+ cos((lat)*pi/180)* cos((sd)*pi/180)* cos((ha)*pi/180)))*(180/pi);
 
 sea = 90 - sza;
 
 
 
%  IF(sea>85,0,IF(sea>5,58.1/tan(pi()/180*(sea))-0.07/POWER(tan(pi()/180*(sea)),3)+0.000086/POWER(tan(pi()/180*(sea)),5),
%  IF(sea>-0.575,1735+sea*(-518.2+sea*(103.4+sea*(-12.79+sea*0.711))),-20.772/tan(pi()/180*(sea)))))/3600
 
   if(sea>85)
      aar = 0;
  
   else if (sea>5)
       
        aar = (58.1/tan(pi()/180*(sea))-0.07/(tan(pi()/180*(sea))^3)+0.000086/(tan(pi()/180*(sea))^5))/3600;
        
    else if (sea>-0.575)
        
      aar = (1735+sea*(-518.2+sea*(103.4+sea*(-12.79+sea*0.711))))/3600;
      
        else
      aar = -20.772/tan(pi()/180*(sea))/3600;
 
        end
       end
   end


   
   seref = sea + aar;
   
   
   if(ha>0)
       
       saza = mod((acos(((sin((lat)*pi/180)* cos((sza)*pi/180))- sin((sd)*pi/180))/(cos((lat)*pi/180)* sin((sza)*pi/180)))*180/pi())+180,360);
       
   else
       saza = mod(540-(acos(((sin((lat)*pi/180)* cos((sza)*pi/180))-sin((sd)*pi/180))/(cos((lat)*pi/180)* sin((sza)*pi/180)))*180/pi),360);
   
   end


% iangle=90-atan(tan(seref*pi()/180)/abs(cos((saza-90)*pi()/180)))*180/pi();



