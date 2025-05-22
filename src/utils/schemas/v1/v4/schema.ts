import type { EvoConfiguration } from "../../types";

const schema: EvoConfiguration[] = [
  {
    handle: "SerialNumber",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "SerialNumber",
    writeKey: null,
    permissions: {
      user: "r",
      installer: "r",
      manufacturer: "r",
    },
    inputs: [
      {
        displayName: "Serial Number",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "FirmwareVersionIOCU",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "FirmwareVersionIOCU",
    writeKey: null,
    permissions: {
      user: "r",
      installer: "r",
      manufacturer: "r",
    },
    inputs: [
      {
        displayName: "IOCU Version",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "FirmwareVersionMCU",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "FirmwareVersionMCU",
    writeKey: null,
    permissions: {
      user: "r",
      installer: "r",
      manufacturer: "r",
    },
    inputs: [
      {
        displayName: "MCU Version",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "Model",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "Model",
    writeKey: null,
    permissions: {
      user: "r",
      installer: "r",
      manufacturer: "r",
    },
    inputs: [
      {
        displayName: "Model",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "MainFuse",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "MainFuse",
    writeKey: "MainFuse",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Main Fuse",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "NumberOfConnectors",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "NumberOfConnectors",
    writeKey: "NumberOfConnectors",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Connectors",
        responseDataKey: "",
        colspan: 2,
        required: false,
        options: [
          {
            value: 1,
            label: "1",
          },
          {
            value: 2,
            label: "2",
          },
        ],
      },
    ],
  },
  {
    handle: "ChargePointCurrentLimit",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "ChargePointCurrentLimit",
    writeKey: "ChargePointCurrentLimit",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Chargepoint Limit",
        responseDataKey: "",
        colspan: 2,
        required: false,
        suffix: "A",
      },
    ],
  },
  {
    handle: "MaxCurrentConnection",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "MaxCurrentConnection",
    writeKey: "MaxCurrentConnection",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Max Socket Limit",
        responseDataKey: "",
        colspan: 2,
        required: false,
        suffix: "A",
      },
    ],
  },
  {
    handle: "BESURL",
    group: "Back Office",
    tab: "Back Office",
    systemKey: false,
    readKey: "BESURL",
    writeKey: "BESURL",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Endpoint URL",
        responseDataKey: "",
        colspan: 4,
        required: false,
      },
    ],
  },
  {
    handle: "ChargePointID",
    group: "Back Office",
    tab: "Back Office",
    systemKey: false,
    readKey: "ChargePointID",
    writeKey: "ChargePointID",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Charge Point ID",
        responseDataKey: "",
        colspan: 4,
        required: false,
      },
    ],
  },
  {
    handle: "NetworkInterface",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "NetworkInterface",
    writeKey: "NetworkInterface",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Network Interface",
        responseDataKey: "",
        colspan: 4,
        required: false,
        options: [
          {
            value: "GSM_COMM_INTERFACE",
            label: "GSM",
          },
          {
            value: "WIFI_COMM_INTERFACE",
            label: "WIFI",
          },
          {
            value: "ETH_COMM_INTERFACE",
            label: "ETHERNET",
          },
        ],
      },
    ],
  },
  {
    handle: "WifiSSID",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "WifiSSID",
    writeKey: "WifiSSID",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "WiFi SSID",
        responseDataKey: "",
        colspan: 4,
        required: false,
      },
    ],
  },
  {
    handle: "WifiPassKey",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "WifiPassKey",
    writeKey: "WifiPassKey",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "WiFi Password",
        responseDataKey: "",
        colspan: 4,
        required: false,
      },
    ],
  },
  {
    handle: "WifiRSSi",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "WifiRSSi",
    writeKey: null,
    permissions: {
      user: "r",
      installer: "r",
      manufacturer: "r",
    },
    inputs: [
      {
        displayName: "WiFi RSSI",
        responseDataKey: "",
        colspan: 4,
        required: false,
      },
    ],
  },
  {
    handle: "EthernetDHCP",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "EthernetDHCP",
    writeKey: "EthernetDHCP",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "DHCP",
        responseDataKey: "",
        colspan: 2,
        required: false,
        options: [
          {
            value: 0,
            label: "False",
          },
          {
            value: 1,
            label: "True",
          },
        ],
      },
    ],
  },
  {
    handle: "EthernetAddress",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "EthernetAddress",
    writeKey: "EthernetAddress",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "IP Address",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "EthernetNetmask",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "EthernetNetmask",
    writeKey: "EthernetNetmask",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Network Mask",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "EthernetGateway",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "EthernetGateway",
    writeKey: "EthernetGateway",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Gateway",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "EthernetGateway",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "EthernetGateway",
    writeKey: "EthernetGateway",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Gateway",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "GPRSAPN",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "GPRSAPN",
    writeKey: "GPRSAPN",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "APN",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "GPRSUser",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "GPRSUser",
    writeKey: "GPRSUser",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "GPRS User",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "GPRSPassword",
    group: "Network",
    tab: "Network",
    systemKey: false,
    readKey: "GPRSPassword",
    writeKey: "GPRSPassword",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "GPRS Password",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "LEDActive",
    group: "Controls",
    tab: "Controls",
    systemKey: false,
    readKey: "LEDActive",
    writeKey: "LEDActive",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "LED Active",
        responseDataKey: "",
        colspan: 2,
        required: false,
        options: [
          {
            value: 0,
            label: "False",
          },
          {
            value: 1,
            label: "True",
          },
        ],
      },
    ],
  },
  {
    handle: "LEDIntensityDefault",
    group: "Controls",
    tab: "Controls",
    systemKey: false,
    readKey: "LEDIntensityDefault",
    writeKey: "LEDIntensityDefault",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "LED Intensity",
        responseDataKey: "",
        colspan: 2,
        required: false,
        options: [
          {
            value: 1,
            label: "Low",
          },
          {
            value: 3,
            label: "Normal",
          },
          {
            value: 5,
            label: "High",
          },
        ],
      },
    ],
  },
  {
    handle: "SolarCT",
    group: "Controls",
    tab: "Controls",
    systemKey: false,
    readKey: "SolarCT",
    writeKey: null,
    permissions: {
      user: "r",
      installer: "r",
      manufacturer: "r",
    },
    inputs: [
      {
        displayName: "Solar CT",
        responseDataKey: "",
        colspan: 2,
        required: false,
        options: [
          {
            value: 0,
            label: "False",
          },
          {
            value: 1,
            label: "True",
          },
        ],
      },
    ],
  },
  {
    handle: "LockConnector",
    group: "Controls",
    tab: "Controls",
    systemKey: false,
    readKey: "LockConnector",
    writeKey: "LockConnector",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Lock Connectors",
        responseDataKey: "",
        colspan: 2,
        required: false,
        options: [
          {
            value: 0,
            label: "False",
          },
          {
            value: 1,
            label: "True",
          },
        ],
      },
    ],
  },
  {
    handle: "OfflineMode",
    group: "Controls",
    tab: "Controls",
    systemKey: false,
    readKey: "OfflineMode",
    writeKey: "OfflineMode",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Offline Mode",
        responseDataKey: "",
        colspan: 4,
        required: false,
        options: [
          {
            value: 0,
            label: "False",
          },
          {
            value: 1,
            label: "True",
          },
        ],
      },
    ],
  },
  {
    handle: "RFIDReader1Enabled",
    group: "Controls",
    tab: "Controls",
    systemKey: false,
    readKey: "RFIDReader1Enabled",
    writeKey: "RFIDReader1Enabled",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "RFID Enabled",
        responseDataKey: "",
        colspan: 4,
        required: false,
        options: [
          {
            value: 0,
            label: "False",
          },
          {
            value: 1,
            label: "True",
          },
        ],
      },
    ],
  },
  {
    handle: "UnlockConnectorOnEVSideDisconnect",
    group: "Controls",
    tab: "Controls",
    systemKey: false,
    readKey: "UnlockConnectorOnEVSideDisconnect",
    writeKey: "UnlockConnectorOnEVSideDisconnect",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Unlock Connector on EV Disconnect",
        responseDataKey: "",
        colspan: 4,
        required: false,
        options: [
          {
            value: 0,
            label: "False",
          },
          {
            value: 1,
            label: "True",
          },
        ],
      },
    ],
  },
  {
    handle: "TamperEnabled",
    group: "Controls",
    tab: "Controls",
    systemKey: false,
    readKey: "TamperEnabled",
    writeKey: "TamperEnabled",
    permissions: {
      user: "r",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Tamper Protection",
        responseDataKey: "",
        colspan: 4,
        required: false,
        options: [
          {
            value: 0,
            label: "False",
          },
          {
            value: 1,
            label: "True",
          },
        ],
      },
    ],
  },
  {
    handle: "StartChargeOnSocket",
    group: "Test",
    tab: "Test",
    systemKey: true,
    readKey: "StartChargeOnSocket",
    writeKey: "StartChargeOnSocket",
    permissions: {
      user: "r",
      installer: "w",
      manufacturer: "w",
    },
    inputs: [
      {
        displayName: "StartChargeOnSocket",
        responseDataKey: "",
        colspan: 2,
        required: false,
      },
    ],
  },
];

export default schema;
