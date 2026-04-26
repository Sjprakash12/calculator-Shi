%  function[ ]=efficiency2025(a)
clc;

clear;


lat=-28.120791;

long=140.186254;


tz=10.5;

date =(43831:44195);

t=[8 9 10 11 12 13 14 15 16 17 18];

for i=1:length(date)

        for j=1:length(t)
    
    if t(j)>solarnoon(lat,long,date(i))
      
        t1(i,j)=2*solarnoon(lat,long,date(i))-t(j);
        
        a(i,j)=incidentangle(lat,long,t1(i,j),tz,date(i));
    
    else
        
        t1(i,j)=t(j);
        
        a(i,j)=incidentangle(lat,long,t1(i,j),tz,date(i));
    
    end
    
        end

end

for i=1:365
    
    for j=1:11
        
        eff(i,j)=efficiency2025(a(i,j));
    end
end

