interface ResultCodes {
    AC01?: "Changed the Zip Code",
    AC02?: "Changed the State",
    AC03?: "Changed the City",
    AC04?: "Changed to Alt. Name",
    AC05?: "Changed Alias",
    AC06?: "Changed Address2",
    AC07?: "Changed Company",
    AC08?: "Changed Zip4",
    AC09?: "Changed Urbanization",
    AC10?: "Changed the Street Name",
    AC11?: "Changed Suffix",
    AC12?: "Changed Directional",
    AC13?: "Changed Suite Name",
    AC14?: "Changed Suite Range",
    AE01?: "Zip Unknown",
    AE02?: "Unknown Street",
    AE03?: "Component Mismatch",
    AE04?: "Non-Deliverable",
    AE05?: "Multiple Matches",
    AE06?: "EWS",
    AE07?: "Invalid Input",
    AE08?: "Invalid Suite",
    AE09?: "Missing Suite",
    AE10?: "Invalid Range",
    AE11?: "Missing Range",
    AE12?: "Invalid PO, HC or RR",
    AE13?: "Missing PO, HC or RR",
    AE14?: "CMRA Missing",
    AE15?: "Demo Mode",
    AE16?: "Expired Database",
    AE17?: "in Suite Range",
    AE19?: "Timed Out",
    AE20?: "Suggestions Disabled",
    AS01?: "Address Matched to Postal Database",
    AS02?: "Street Address Match",
    AS03?: "Non-USPS Address",
    AS09?: "Foreign Zip Code",
    AS10?: "UPS Store",
    AS13?: "LACS Conversion",
    AS14?: "Suite Appended Link",
    AS15?: "Suite Appended by AP",
    AS16?: "Address is vacant",
    AS17?: "Alternate Delivery",
    AS18?: "DPV Error",
    AS20?: "No UPS or FedEx Delivery",
    AS22?: "No Suggestions",
    AS23?: "Extra Info found"
}

interface AddressCorrectionInput {
    address?: string;
    address2?: string;
    company?: string;
    zip?: string;
    state?: string;
    zip4?: string;
    Consumer: string;
}

interface GeocodeInput {
    address?: string;
    city?: string;
    zip?: string;
    zip4?: string;
    Consumer: string;
}

interface AddressCorrectionResponse {
    input: {
        Address: string;
        Address2: string;
        Company: string;
        MunicipalJurisdiction: string;
        ZipCode: string;
        ZipPlus4: string;
        StateName: string;
        Username: string;
    }
    DeliveryAddress: string;
    DeliveryAddress2: string;
    PlaceName: string;
    ZipCode: string;
    ZipPlus4: string;
    StateName: string;
    County: string;
    ANSIStateCountyCode: string;
    Company: string;
    OfficialStatus: string;
    StreetNamePreDirectional: string;
    AddressNumber: string;
    StreetName: string;
    StreetNamePostType: string;
    StreetNamePostDirectional: string;
    SubaddressIdentifier: string;
    SubaddressType: string;
    MailableAddress: string;
    Quality: string;
    Results: ResultCodes;
    ErrorStatus: string;
    Candidate1: string;
    Candidate2: string;
    Candidate3: string;
    Candidate4: string;
    Candidate5: string;
    Garbage: string;
    MDexpires: Date;
    /**
     * MelissaData Residential/Business Indicator
     */
    MDRBDI: string;
}

interface GeocodeResponse {
    input: {
        address?: string;
        zip?: string;
        municipaljurisdiction?: string;
        zip4?: string;
        consumer?: string;
    }
    status?: string;
    score?: string;
    source?: string;
    locator?: string;
    accuracy?: string;
    longitude?: string;
    latitude?: string;
    Av_date?: string;
    error_status?: string;
}

declare class Wamas {
    constructor(url?: string);
    addressCorrectionUrl: string;
    geocodeUrl: string;
    correctAddress(AddressCorrectionInputInterface): Promise<AddressCorrectionResponse>;
    geocode(GeocodeInputInterface): Promise<GeocodeResponse>;
}