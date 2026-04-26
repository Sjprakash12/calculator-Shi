
function[solnoon]=solarnoon(lat,long,tz,date)

% time zone

% tz=10.5;

% Date+


t=11;

time = t*10*0.1/24;


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


sra=180/pi()*atan((cos(pi/180*sal))/(cos(pi/180*oc)*sin(pi/180*sal)));

sd = (asin(sin((oc)*pi/180)* sin((sal)*pi/180)))*(180/pi);

vary = tan((oc/2)*pi/180)* tan((oc/2)*pi/180);

eqoft=4*180/pi()*(vary*sin(2*pi()/180*(gmls))-2*eeo*sin(pi()/180*(gmas))+4*eeo*vary*sin(pi()/180*(gmas))*cos(2*pi()/180*(gmls))-0.5*vary*vary*sin(4*pi()/180*(gmls))-1.25*eeo*eeo*sin(2*pi()/180*(gmas)));

has = (acos(cos((90.833)*pi/180)/(cos((lat)*pi/180)* cos((sd)*pi/180))- tan((lat)*pi/180)* tan((sd)*pi/180)))*(180/pi);

sn = (720-4*long- eqoft + tz *60)/1440;
solnoon=sn*24;

