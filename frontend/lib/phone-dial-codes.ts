export type PhoneDialOption = {
  /** Unique select value */
  value: string;
  /** 2-3 letter display prefix (ISO-style) */
  prefix: string;
  code: string;
  label: string;
};

/** ITU-T E.164 calling codes: priority markets first, then alphabetical. */
export const PHONE_DIAL_CODES: readonly PhoneDialOption[] = [
  {
    "value": "us",
    "prefix": "US",
    "code": "+1",
    "label": "United States"
  },
  {
    "value": "gb",
    "prefix": "UK",
    "code": "+44",
    "label": "United Kingdom"
  },
  {
    "value": "in",
    "prefix": "IN",
    "code": "+91",
    "label": "India"
  },
  {
    "value": "pk",
    "prefix": "PK",
    "code": "+92",
    "label": "Pakistan"
  },
  {
    "value": "ae",
    "prefix": "UAE",
    "code": "+971",
    "label": "United Arab Emirates"
  },
  {
    "value": "sa",
    "prefix": "SA",
    "code": "+966",
    "label": "Saudi Arabia"
  },
  {
    "value": "qa",
    "prefix": "QA",
    "code": "+974",
    "label": "Qatar"
  },
  {
    "value": "kw",
    "prefix": "KW",
    "code": "+965",
    "label": "Kuwait"
  },
  {
    "value": "bh",
    "prefix": "BH",
    "code": "+973",
    "label": "Bahrain"
  },
  {
    "value": "om",
    "prefix": "OM",
    "code": "+968",
    "label": "Oman"
  },
  {
    "value": "de",
    "prefix": "DE",
    "code": "+49",
    "label": "Germany"
  },
  {
    "value": "fr",
    "prefix": "FR",
    "code": "+33",
    "label": "France"
  },
  {
    "value": "au",
    "prefix": "AU",
    "code": "+61",
    "label": "Australia"
  },
  {
    "value": "sg",
    "prefix": "SG",
    "code": "+65",
    "label": "Singapore"
  },
  {
    "value": "za",
    "prefix": "ZA",
    "code": "+27",
    "label": "South Africa"
  },
  {
    "value": "af",
    "prefix": "AF",
    "code": "+93",
    "label": "Afghanistan"
  },
  {
    "value": "al",
    "prefix": "AL",
    "code": "+355",
    "label": "Albania"
  },
  {
    "value": "dz",
    "prefix": "DZ",
    "code": "+213",
    "label": "Algeria"
  },
  {
    "value": "ad",
    "prefix": "AD",
    "code": "+376",
    "label": "Andorra"
  },
  {
    "value": "ao",
    "prefix": "AO",
    "code": "+244",
    "label": "Angola"
  },
  {
    "value": "ag",
    "prefix": "AG",
    "code": "+1",
    "label": "Antigua and Barbuda"
  },
  {
    "value": "ar",
    "prefix": "AR",
    "code": "+54",
    "label": "Argentina"
  },
  {
    "value": "am",
    "prefix": "AM",
    "code": "+374",
    "label": "Armenia"
  },
  {
    "value": "at",
    "prefix": "AT",
    "code": "+43",
    "label": "Austria"
  },
  {
    "value": "az",
    "prefix": "AZ",
    "code": "+994",
    "label": "Azerbaijan"
  },
  {
    "value": "bs",
    "prefix": "BS",
    "code": "+1",
    "label": "Bahamas"
  },
  {
    "value": "bd",
    "prefix": "BD",
    "code": "+880",
    "label": "Bangladesh"
  },
  {
    "value": "bb",
    "prefix": "BB",
    "code": "+1",
    "label": "Barbados"
  },
  {
    "value": "by",
    "prefix": "BY",
    "code": "+375",
    "label": "Belarus"
  },
  {
    "value": "be",
    "prefix": "BE",
    "code": "+32",
    "label": "Belgium"
  },
  {
    "value": "bz",
    "prefix": "BZ",
    "code": "+501",
    "label": "Belize"
  },
  {
    "value": "bj",
    "prefix": "BJ",
    "code": "+229",
    "label": "Benin"
  },
  {
    "value": "bt",
    "prefix": "BT",
    "code": "+975",
    "label": "Bhutan"
  },
  {
    "value": "bo",
    "prefix": "BO",
    "code": "+591",
    "label": "Bolivia"
  },
  {
    "value": "ba",
    "prefix": "BA",
    "code": "+387",
    "label": "Bosnia and Herzegovina"
  },
  {
    "value": "bw",
    "prefix": "BW",
    "code": "+267",
    "label": "Botswana"
  },
  {
    "value": "br",
    "prefix": "BR",
    "code": "+55",
    "label": "Brazil"
  },
  {
    "value": "bn",
    "prefix": "BN",
    "code": "+673",
    "label": "Brunei"
  },
  {
    "value": "bg",
    "prefix": "BG",
    "code": "+359",
    "label": "Bulgaria"
  },
  {
    "value": "bf",
    "prefix": "BF",
    "code": "+226",
    "label": "Burkina Faso"
  },
  {
    "value": "bi",
    "prefix": "BI",
    "code": "+257",
    "label": "Burundi"
  },
  {
    "value": "cv",
    "prefix": "CV",
    "code": "+238",
    "label": "Cabo Verde"
  },
  {
    "value": "kh",
    "prefix": "KH",
    "code": "+855",
    "label": "Cambodia"
  },
  {
    "value": "cm",
    "prefix": "CM",
    "code": "+237",
    "label": "Cameroon"
  },
  {
    "value": "ca",
    "prefix": "CA",
    "code": "+1",
    "label": "Canada"
  },
  {
    "value": "cf",
    "prefix": "CF",
    "code": "+236",
    "label": "Central African Republic"
  },
  {
    "value": "td",
    "prefix": "TD",
    "code": "+235",
    "label": "Chad"
  },
  {
    "value": "cl",
    "prefix": "CL",
    "code": "+56",
    "label": "Chile"
  },
  {
    "value": "cn",
    "prefix": "CN",
    "code": "+86",
    "label": "China"
  },
  {
    "value": "co",
    "prefix": "CO",
    "code": "+57",
    "label": "Colombia"
  },
  {
    "value": "km",
    "prefix": "KM",
    "code": "+269",
    "label": "Comoros"
  },
  {
    "value": "cg",
    "prefix": "CG",
    "code": "+242",
    "label": "Congo"
  },
  {
    "value": "cd",
    "prefix": "CD",
    "code": "+243",
    "label": "Congo (DRC)"
  },
  {
    "value": "cr",
    "prefix": "CR",
    "code": "+506",
    "label": "Costa Rica"
  },
  {
    "value": "ci",
    "prefix": "CI",
    "code": "+225",
    "label": "Cote d'Ivoire"
  },
  {
    "value": "hr",
    "prefix": "HR",
    "code": "+385",
    "label": "Croatia"
  },
  {
    "value": "cu",
    "prefix": "CU",
    "code": "+53",
    "label": "Cuba"
  },
  {
    "value": "cy",
    "prefix": "CY",
    "code": "+357",
    "label": "Cyprus"
  },
  {
    "value": "cz",
    "prefix": "CZ",
    "code": "+420",
    "label": "Czech Republic"
  },
  {
    "value": "dk",
    "prefix": "DK",
    "code": "+45",
    "label": "Denmark"
  },
  {
    "value": "dj",
    "prefix": "DJ",
    "code": "+253",
    "label": "Djibouti"
  },
  {
    "value": "dm",
    "prefix": "DM",
    "code": "+1",
    "label": "Dominica"
  },
  {
    "value": "do",
    "prefix": "DO",
    "code": "+1",
    "label": "Dominican Republic"
  },
  {
    "value": "ec",
    "prefix": "EC",
    "code": "+593",
    "label": "Ecuador"
  },
  {
    "value": "eg",
    "prefix": "EG",
    "code": "+20",
    "label": "Egypt"
  },
  {
    "value": "sv",
    "prefix": "SV",
    "code": "+503",
    "label": "El Salvador"
  },
  {
    "value": "gq",
    "prefix": "GQ",
    "code": "+240",
    "label": "Equatorial Guinea"
  },
  {
    "value": "er",
    "prefix": "ER",
    "code": "+291",
    "label": "Eritrea"
  },
  {
    "value": "ee",
    "prefix": "EE",
    "code": "+372",
    "label": "Estonia"
  },
  {
    "value": "sz",
    "prefix": "SZ",
    "code": "+268",
    "label": "Eswatini"
  },
  {
    "value": "et",
    "prefix": "ET",
    "code": "+251",
    "label": "Ethiopia"
  },
  {
    "value": "fj",
    "prefix": "FJ",
    "code": "+679",
    "label": "Fiji"
  },
  {
    "value": "fi",
    "prefix": "FI",
    "code": "+358",
    "label": "Finland"
  },
  {
    "value": "ga",
    "prefix": "GA",
    "code": "+241",
    "label": "Gabon"
  },
  {
    "value": "gm",
    "prefix": "GM",
    "code": "+220",
    "label": "Gambia"
  },
  {
    "value": "ge",
    "prefix": "GE",
    "code": "+995",
    "label": "Georgia"
  },
  {
    "value": "gh",
    "prefix": "GH",
    "code": "+233",
    "label": "Ghana"
  },
  {
    "value": "gr",
    "prefix": "GR",
    "code": "+30",
    "label": "Greece"
  },
  {
    "value": "gd",
    "prefix": "GD",
    "code": "+1",
    "label": "Grenada"
  },
  {
    "value": "gt",
    "prefix": "GT",
    "code": "+502",
    "label": "Guatemala"
  },
  {
    "value": "gn",
    "prefix": "GN",
    "code": "+224",
    "label": "Guinea"
  },
  {
    "value": "gw",
    "prefix": "GW",
    "code": "+245",
    "label": "Guinea-Bissau"
  },
  {
    "value": "gy",
    "prefix": "GY",
    "code": "+592",
    "label": "Guyana"
  },
  {
    "value": "ht",
    "prefix": "HT",
    "code": "+509",
    "label": "Haiti"
  },
  {
    "value": "hn",
    "prefix": "HN",
    "code": "+504",
    "label": "Honduras"
  },
  {
    "value": "hk",
    "prefix": "HK",
    "code": "+852",
    "label": "Hong Kong"
  },
  {
    "value": "hu",
    "prefix": "HU",
    "code": "+36",
    "label": "Hungary"
  },
  {
    "value": "is",
    "prefix": "IS",
    "code": "+354",
    "label": "Iceland"
  },
  {
    "value": "id",
    "prefix": "ID",
    "code": "+62",
    "label": "Indonesia"
  },
  {
    "value": "ir",
    "prefix": "IR",
    "code": "+98",
    "label": "Iran"
  },
  {
    "value": "iq",
    "prefix": "IQ",
    "code": "+964",
    "label": "Iraq"
  },
  {
    "value": "ie",
    "prefix": "IE",
    "code": "+353",
    "label": "Ireland"
  },
  {
    "value": "il",
    "prefix": "IL",
    "code": "+972",
    "label": "Israel"
  },
  {
    "value": "it",
    "prefix": "IT",
    "code": "+39",
    "label": "Italy"
  },
  {
    "value": "jm",
    "prefix": "JM",
    "code": "+1",
    "label": "Jamaica"
  },
  {
    "value": "jp",
    "prefix": "JP",
    "code": "+81",
    "label": "Japan"
  },
  {
    "value": "jo",
    "prefix": "JO",
    "code": "+962",
    "label": "Jordan"
  },
  {
    "value": "kz",
    "prefix": "KZ",
    "code": "+7",
    "label": "Kazakhstan"
  },
  {
    "value": "ke",
    "prefix": "KE",
    "code": "+254",
    "label": "Kenya"
  },
  {
    "value": "ki",
    "prefix": "KI",
    "code": "+686",
    "label": "Kiribati"
  },
  {
    "value": "kg",
    "prefix": "KG",
    "code": "+996",
    "label": "Kyrgyzstan"
  },
  {
    "value": "la",
    "prefix": "LA",
    "code": "+856",
    "label": "Laos"
  },
  {
    "value": "lv",
    "prefix": "LV",
    "code": "+371",
    "label": "Latvia"
  },
  {
    "value": "lb",
    "prefix": "LB",
    "code": "+961",
    "label": "Lebanon"
  },
  {
    "value": "ls",
    "prefix": "LS",
    "code": "+266",
    "label": "Lesotho"
  },
  {
    "value": "lr",
    "prefix": "LR",
    "code": "+231",
    "label": "Liberia"
  },
  {
    "value": "ly",
    "prefix": "LY",
    "code": "+218",
    "label": "Libya"
  },
  {
    "value": "li",
    "prefix": "LI",
    "code": "+423",
    "label": "Liechtenstein"
  },
  {
    "value": "lt",
    "prefix": "LT",
    "code": "+370",
    "label": "Lithuania"
  },
  {
    "value": "lu",
    "prefix": "LU",
    "code": "+352",
    "label": "Luxembourg"
  },
  {
    "value": "mo",
    "prefix": "MO",
    "code": "+853",
    "label": "Macau"
  },
  {
    "value": "mg",
    "prefix": "MG",
    "code": "+261",
    "label": "Madagascar"
  },
  {
    "value": "mw",
    "prefix": "MW",
    "code": "+265",
    "label": "Malawi"
  },
  {
    "value": "my",
    "prefix": "MY",
    "code": "+60",
    "label": "Malaysia"
  },
  {
    "value": "mv",
    "prefix": "MV",
    "code": "+960",
    "label": "Maldives"
  },
  {
    "value": "ml",
    "prefix": "ML",
    "code": "+223",
    "label": "Mali"
  },
  {
    "value": "mt",
    "prefix": "MT",
    "code": "+356",
    "label": "Malta"
  },
  {
    "value": "mh",
    "prefix": "MH",
    "code": "+692",
    "label": "Marshall Islands"
  },
  {
    "value": "mr",
    "prefix": "MR",
    "code": "+222",
    "label": "Mauritania"
  },
  {
    "value": "mu",
    "prefix": "MU",
    "code": "+230",
    "label": "Mauritius"
  },
  {
    "value": "mx",
    "prefix": "MX",
    "code": "+52",
    "label": "Mexico"
  },
  {
    "value": "fm",
    "prefix": "FM",
    "code": "+691",
    "label": "Micronesia"
  },
  {
    "value": "md",
    "prefix": "MD",
    "code": "+373",
    "label": "Moldova"
  },
  {
    "value": "mc",
    "prefix": "MC",
    "code": "+377",
    "label": "Monaco"
  },
  {
    "value": "mn",
    "prefix": "MN",
    "code": "+976",
    "label": "Mongolia"
  },
  {
    "value": "me",
    "prefix": "ME",
    "code": "+382",
    "label": "Montenegro"
  },
  {
    "value": "ma",
    "prefix": "MA",
    "code": "+212",
    "label": "Morocco"
  },
  {
    "value": "mz",
    "prefix": "MZ",
    "code": "+258",
    "label": "Mozambique"
  },
  {
    "value": "mm",
    "prefix": "MM",
    "code": "+95",
    "label": "Myanmar"
  },
  {
    "value": "na",
    "prefix": "NA",
    "code": "+264",
    "label": "Namibia"
  },
  {
    "value": "nr",
    "prefix": "NR",
    "code": "+674",
    "label": "Nauru"
  },
  {
    "value": "np",
    "prefix": "NP",
    "code": "+977",
    "label": "Nepal"
  },
  {
    "value": "nl",
    "prefix": "NL",
    "code": "+31",
    "label": "Netherlands"
  },
  {
    "value": "nz",
    "prefix": "NZ",
    "code": "+64",
    "label": "New Zealand"
  },
  {
    "value": "ni",
    "prefix": "NI",
    "code": "+505",
    "label": "Nicaragua"
  },
  {
    "value": "ne",
    "prefix": "NE",
    "code": "+227",
    "label": "Niger"
  },
  {
    "value": "ng",
    "prefix": "NG",
    "code": "+234",
    "label": "Nigeria"
  },
  {
    "value": "mk",
    "prefix": "MK",
    "code": "+389",
    "label": "North Macedonia"
  },
  {
    "value": "no",
    "prefix": "NO",
    "code": "+47",
    "label": "Norway"
  },
  {
    "value": "pw",
    "prefix": "PW",
    "code": "+680",
    "label": "Palau"
  },
  {
    "value": "ps",
    "prefix": "PS",
    "code": "+970",
    "label": "Palestine"
  },
  {
    "value": "pa",
    "prefix": "PA",
    "code": "+507",
    "label": "Panama"
  },
  {
    "value": "pg",
    "prefix": "PG",
    "code": "+675",
    "label": "Papua New Guinea"
  },
  {
    "value": "py",
    "prefix": "PY",
    "code": "+595",
    "label": "Paraguay"
  },
  {
    "value": "pe",
    "prefix": "PE",
    "code": "+51",
    "label": "Peru"
  },
  {
    "value": "ph",
    "prefix": "PH",
    "code": "+63",
    "label": "Philippines"
  },
  {
    "value": "pl",
    "prefix": "PL",
    "code": "+48",
    "label": "Poland"
  },
  {
    "value": "pt",
    "prefix": "PT",
    "code": "+351",
    "label": "Portugal"
  },
  {
    "value": "ro",
    "prefix": "RO",
    "code": "+40",
    "label": "Romania"
  },
  {
    "value": "ru",
    "prefix": "RU",
    "code": "+7",
    "label": "Russia"
  },
  {
    "value": "rw",
    "prefix": "RW",
    "code": "+250",
    "label": "Rwanda"
  },
  {
    "value": "kn",
    "prefix": "KN",
    "code": "+1",
    "label": "Saint Kitts and Nevis"
  },
  {
    "value": "lc",
    "prefix": "LC",
    "code": "+1",
    "label": "Saint Lucia"
  },
  {
    "value": "vc",
    "prefix": "VC",
    "code": "+1",
    "label": "Saint Vincent and the Grenadines"
  },
  {
    "value": "ws",
    "prefix": "WS",
    "code": "+685",
    "label": "Samoa"
  },
  {
    "value": "sm",
    "prefix": "SM",
    "code": "+378",
    "label": "San Marino"
  },
  {
    "value": "st",
    "prefix": "ST",
    "code": "+239",
    "label": "Sao Tome and Principe"
  },
  {
    "value": "sn",
    "prefix": "SN",
    "code": "+221",
    "label": "Senegal"
  },
  {
    "value": "rs",
    "prefix": "RS",
    "code": "+381",
    "label": "Serbia"
  },
  {
    "value": "sc",
    "prefix": "SC",
    "code": "+248",
    "label": "Seychelles"
  },
  {
    "value": "sl",
    "prefix": "SL",
    "code": "+232",
    "label": "Sierra Leone"
  },
  {
    "value": "sk",
    "prefix": "SK",
    "code": "+421",
    "label": "Slovakia"
  },
  {
    "value": "si",
    "prefix": "SI",
    "code": "+386",
    "label": "Slovenia"
  },
  {
    "value": "sb",
    "prefix": "SB",
    "code": "+677",
    "label": "Solomon Islands"
  },
  {
    "value": "so",
    "prefix": "SO",
    "code": "+252",
    "label": "Somalia"
  },
  {
    "value": "kr",
    "prefix": "KR",
    "code": "+82",
    "label": "South Korea"
  },
  {
    "value": "ss",
    "prefix": "SS",
    "code": "+211",
    "label": "South Sudan"
  },
  {
    "value": "es",
    "prefix": "ES",
    "code": "+34",
    "label": "Spain"
  },
  {
    "value": "lk",
    "prefix": "LK",
    "code": "+94",
    "label": "Sri Lanka"
  },
  {
    "value": "sd",
    "prefix": "SD",
    "code": "+249",
    "label": "Sudan"
  },
  {
    "value": "sr",
    "prefix": "SR",
    "code": "+597",
    "label": "Suriname"
  },
  {
    "value": "se",
    "prefix": "SE",
    "code": "+46",
    "label": "Sweden"
  },
  {
    "value": "ch",
    "prefix": "CH",
    "code": "+41",
    "label": "Switzerland"
  },
  {
    "value": "sy",
    "prefix": "SY",
    "code": "+963",
    "label": "Syria"
  },
  {
    "value": "tw",
    "prefix": "TW",
    "code": "+886",
    "label": "Taiwan"
  },
  {
    "value": "tj",
    "prefix": "TJ",
    "code": "+992",
    "label": "Tajikistan"
  },
  {
    "value": "tz",
    "prefix": "TZ",
    "code": "+255",
    "label": "Tanzania"
  },
  {
    "value": "th",
    "prefix": "TH",
    "code": "+66",
    "label": "Thailand"
  },
  {
    "value": "tl",
    "prefix": "TL",
    "code": "+670",
    "label": "Timor-Leste"
  },
  {
    "value": "tg",
    "prefix": "TG",
    "code": "+228",
    "label": "Togo"
  },
  {
    "value": "to",
    "prefix": "TO",
    "code": "+676",
    "label": "Tonga"
  },
  {
    "value": "tt",
    "prefix": "TT",
    "code": "+1",
    "label": "Trinidad and Tobago"
  },
  {
    "value": "tn",
    "prefix": "TN",
    "code": "+216",
    "label": "Tunisia"
  },
  {
    "value": "tr",
    "prefix": "TR",
    "code": "+90",
    "label": "Turkey"
  },
  {
    "value": "tm",
    "prefix": "TM",
    "code": "+993",
    "label": "Turkmenistan"
  },
  {
    "value": "tv",
    "prefix": "TV",
    "code": "+688",
    "label": "Tuvalu"
  },
  {
    "value": "ug",
    "prefix": "UG",
    "code": "+256",
    "label": "Uganda"
  },
  {
    "value": "ua",
    "prefix": "UA",
    "code": "+380",
    "label": "Ukraine"
  },
  {
    "value": "uy",
    "prefix": "UY",
    "code": "+598",
    "label": "Uruguay"
  },
  {
    "value": "uz",
    "prefix": "UZ",
    "code": "+998",
    "label": "Uzbekistan"
  },
  {
    "value": "vu",
    "prefix": "VU",
    "code": "+678",
    "label": "Vanuatu"
  },
  {
    "value": "ve",
    "prefix": "VE",
    "code": "+58",
    "label": "Venezuela"
  },
  {
    "value": "vn",
    "prefix": "VN",
    "code": "+84",
    "label": "Vietnam"
  },
  {
    "value": "ye",
    "prefix": "YE",
    "code": "+967",
    "label": "Yemen"
  },
  {
    "value": "zm",
    "prefix": "ZM",
    "code": "+260",
    "label": "Zambia"
  },
  {
    "value": "zw",
    "prefix": "ZW",
    "code": "+263",
    "label": "Zimbabwe"
  }
];