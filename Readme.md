## Address Correction ##

### Sample Request ##

http://geoservicestest.wa.gov/addresscorrection_v2/service.asmx/Getstandardizedaddress?address=101%20Is%20reel%20Rd&address2=p.o.%20bo%20x%2047904&company=WA%20DOH&zip=98502&zip4=9656&state=WA&city=Tumwa

### Sample Response ###

```xml
<?xml version="1.0" encoding="utf-8"?>
<Address_Correction xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.doh.wa.gov/gis">
  <input_Address>101 Is reel Rd</input_Address>
  <input_Address2>p.o. bo x 47904</input_Address2>
  <input_Company>WA DOH</input_Company>
  <input_MunicipalJurisdiction>Tumwa</input_MunicipalJurisdiction>
  <input_ZipCode>98502</input_ZipCode>
  <input_ZipPlus4>9656</input_ZipPlus4>
  <input_StateName>WA</input_StateName>
  <Address>101 Israel Rd SE</Address>
  <Address2>p.o. bo x 47904</Address2>
  <Company>WA DOH</Company>
  <Garbage />
  <AddressType>Street</AddressType>
  <MunicipalJurisdiction>Tumwater</MunicipalJurisdiction>
  <ZipCode>98501</ZipCode>
  <ZipPlus4>5570</ZipPlus4>
  <StateName>WA</StateName>
  <County>Thurston</County>
  <PreDirectional />
  <Number>101</Number>
  <StreetName>Israel</StreetName>
  <PreType />
  <PostSuffix>Rd</PostSuffix>
  <PostDirectional>SE</PostDirectional>
  <Unit />
  <UnitType />
  <Found>Yes</Found>
  <Quality>Address found in USPS database</Quality>
  <Results>AC01,AC03,AC10,AC12,AS01</Results>
  <ErrorStatus />
  <Candidate1 />
  <Candidate2 />
  <Candidate3 />
  <Candidate4 />
  <Candidate5 />
  <Addresskey>98501557001</Addresskey>
</Address_Correction>
```

## Geocode ##

### Sample Request ###

http://geoservicestest.wa.gov/geocoder_v2/service.asmx/FindAddress?address=101%20Israel%20Rd%20SE&zip=98501&city=Tumwater&zip4=5570&AddressKey=98501557001

### Sample Response ###

```xml
<?xml version="1.0" encoding="utf-8"?>
<Geocode
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns="http://geography.wa.gov/GeospatialPortal/">
    <input_address>101 Israel Rd SE</input_address>
    <input_zip>98501</input_zip>
    <input_municipaljurisdiction>Tumwater</input_municipaljurisdiction>
    <input_zip4>5570</input_zip4>
    <input_addresskey>98501557001</input_addresskey>
    <status>M</status>
    <score>94</score>
    <source>MAF</source>
    <accuracy>Close</accuracy>
    <longitude>-122.90647</longitude>
    <latitude>46.98523</latitude>
    <Av_date>1/27/2014 1:38:29 PM</Av_date>
    <error_status />
</Geocode>
```