import icons from "../../../../public/icons";
import images from "../../../../public/images";

export const addBeneficiaryLabel = (dark: boolean) => ({
  inputProps: { "aria-label": "Switch demo" },
  sx: {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#D4B139", // Custom active color for the thumb
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#4caf50", // Custom active color for the track
    },
    ...(dark && {
      "& .MuiSwitch-track": {
        backgroundColor: "#ffffff", // Inactive background color for the track
      },
    }),
  },
});

export const NetworkProvider = [
  {
    id: 1,
    name: "MTN",
    logo: images.airtime.mtnLogo,
  },
  {
    id: 2,
    name: "GLO",
    logo: images.airtime.gloLogo,
  },
  {
    id: 3,
    name: "AIRTEL",
    logo: images.airtime.airtelLogo,
  },
  {
    id: 4,
    name: "ETISALAT",
    logo: images.airtime.etisalatLogo,
  },
];

export const dataPlanNetwork = [
  {
    id: 1,
    value: "mtn",
    label: "MTN Data",
  },
  {
    id: 2,
    value: "glo",
    label: "GLO Data",
  },
  {
    id: 3,
    value: "airtel",
    label: "AIRTEL Data",
  },
  {
    id: 4,
    value: "9mobile",
    label: "9MOBILE Data",
  },
];

export const cablePlansData = [
  {
    id: 1,
    value: "dstv",
    label: "DSTV",
  },
  {
    id: 2,
    value: "gotv",
    label: "GOTV",
  },
  {
    id: 3,
    value: "startimes",
    label: "STARTIMES",
  },
];

export const ElectricityProvidersData = [
  {
    disco: "aba",
    acronym: "ABEDC",
    label: "Aba Electricity",
    logo: icons.userIcons.abedc,
  },
  {
    disco: "abuja",
    acronym: "AEDC",
    label: "Abuja Electricity",
    logo: icons.userIcons.aedc,
  },
  {
    disco: "benin",
    acronym: "BEDC",
    label: "Benin Electricity",
    logo: icons.userIcons.bedc,
  },
  {
    disco: "eko disco",
    acronym: "EKEDC",
    label: "Eko Electricity",
    logo: icons.userIcons.ekedc,
  },
  {
    disco: "enugu",
    acronym: "EEDC",
    label: "Enugu Electricity",
    logo: icons.userIcons.eedc,
  },
  {
    disco: "ibadan",
    acronym: "IBEDC",
    label: "Ibadan Electric",
    logo: icons.userIcons.ibedc,
  },
  {
    disco: "ikeja",
    acronym: "IKEDC",
    label: "Ikeja Electric",
    logo: icons.userIcons.ikedc,
  },
  {
    disco: "jos",
    acronym: "JED",
    label: "Jos Electric",
    logo: icons.userIcons.jed,
  },
  {
    disco: "kaduna",
    acronym: "KAEDCO",
    label: "Kaduna Electric",
    logo: icons.userIcons.kaedco,
  },
  {
    disco: "kano",
    acronym: "KEDCO",
    label: "Kano Electric",
    logo: icons.userIcons.kedco,
  },
  {
    disco: "port harcourt",
    acronym: "PHED",
    label: "Port Harcourt Electric",
    logo: icons.userIcons.phed,
  },
  {
    disco: "yola",
    acronym: "YEDC",
    label: "Yola Electric",
    logo: icons.userIcons.yedc,
  },
];
