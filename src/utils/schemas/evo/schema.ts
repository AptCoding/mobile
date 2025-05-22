import type { EvoConfiguration } from "../types";
import { centiampereToAmpere } from "../formatters";

const schema: EvoConfiguration[] = [
  {
    handle: "DEVICE_INFO",
    group: "info",
    tab: "Specifications",
    systemKey: false,
    readKey: "Device information query",
    writeKey: null,
    permissions: {
      user: "r",
      installer: "r",
      manufacturer: "r",
    },
    inputs: [
      {
        displayName: "Serial Number",
        responseDataKey: "SN Number",
        colspan: 2,
        required: false,
      },
      {
        displayName: "Firmware Version",
        responseDataKey: "fw version",
        colspan: 2,
        required: false,
      },
    ],
  },
  {
    handle: "MAX_OUTPUT",
    group: "Specifications",
    tab: "Specifications",
    systemKey: false,
    readKey: "Get current parameters",
    writeKey: "Set current parameter",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    parameters: [
      {
        responseDataKey: "Parameter type",
        value: "1",
      },
    ],
    inputs: [
      {
        displayName: "Max. Output",
        responseDataKey: "Parameter values",
        colspan: 2,
        required: true,
        suffix: "A",
        formatter: centiampereToAmpere,
      },
    ],
  },
  {
    handle: "USER_OUTPUT",
    group: "Specifications",
    tab: "Specifications",
    systemKey: false,
    readKey: "Get current parameters",
    writeKey: "Set current parameter",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    parameters: [
      {
        responseDataKey: "Parameter type",
        value: "2",
      },
    ],
    inputs: [
      {
        displayName: "User Output",
        responseDataKey: "Parameter values",
        colspan: 2,
        required: true,
        suffix: "A",
        formatter: centiampereToAmpere,
      },
    ],
  },
  {
    handle: "GRID_TYPE",
    group: "Specifications",
    tab: "Specifications",
    systemKey: false,
    readKey: "Get power type",
    writeKey: "Set power type",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Grid Type",
        responseDataKey: "Parameter values",
        colspan: 2,
        required: true,
        options: [
          {
            value: 0,
            label: "TN-NL1",
          },
          {
            value: 3,
            label: "TN-NL1L2L3",
          },
          {
            value: 4,
            label: "IT-L1L2",
          },
          {
            value: 7,
            label: "IT-L1L2L3",
          },
        ],
      },
    ],
  },
  {
    handle: "MAIN_FUSE",
    group: "Specifications",
    tab: "Specifications",
    systemKey: false,
    readKey: "Get current parameters",
    writeKey: "Set current parameter",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    parameters: [
      {
        responseDataKey: "Parameter type",
        value: "0",
      },
    ],
    inputs: [
      {
        displayName: "Main Fuse",
        responseDataKey: "Parameter values",
        colspan: 2,
        required: true,
        suffix: "A",
        formatter: centiampereToAmpere,
      },
    ],
  },
  {
    handle: "OCPP_URL",
    group: "Back Office",
    tab: "Back Office",
    systemKey: false,
    readKey: "Get OCPP URL",
    writeKey: "Set OCPP URL",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Endpoint",
        responseDataKey: "URL",
        colspan: 4,
        required: true,
      },
    ],
  },
  {
    handle: "CHARGER_ID",
    group: "Back Office",
    tab: "Back Office",
    systemKey: false,
    readKey: "Get OCPP ChargerID",
    writeKey: "Set OCPP ChargerID",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Charger ID",
        responseDataKey: "Charger ID",
        colspan: 4,
        required: true,
      },
    ],
  },
  {
    handle: "AUTH_USER",
    group: "Back Office",
    tab: "Back Office",
    systemKey: false,
    writeKey: "Set HTTP Basic Authentication account",
    readKey: "Get HTTP Basic Authentication account",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Username",
        responseDataKey: "Account",
        colspan: 4,
        required: false,
      },
    ],
  },
  {
    handle: "AUTH_PASS",
    group: "Back Office",
    tab: "Back Office",
    systemKey: false,
    writeKey: "Set HTTP Basic Authentication password",
    readKey: "Get HTTP Basic Authentication password",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Password",
        responseDataKey: "Password",
        colspan: 4,
        required: false,
      },
    ],
  },
  {
    handle: "NETWORK_MODE",
    group: "Network",
    tab: "Network",
    systemKey: false,
    writeKey: "Set network mode",
    readKey: "Get network mode",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Network Mode",
        responseDataKey: "Parameter values",
        colspan: 2,
        required: true,
        options: [
          {
            value: 0,
            label: "Offline Mode",
          },
          {
            value: 1,
            label: "WiFi",
          },
          {
            value: 2,
            label: "WiFi & Ethernet",
          },
          {
            value: 3,
            label: "WiFi & LTE ",
          },
        ],
      },
    ],
  },
  {
    handle: "WIFI",
    group: "Network",
    tab: "Network",
    systemKey: false,
    writeKey: "Set WIFI parameters",
    readKey: "Get WIFI parameters",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "WiFi SSID",
        responseDataKey: "SSID",
        colspan: 4,
        required: false,
      },
      {
        displayName: "WiFi Password",
        responseDataKey: "Password",
        colspan: 4,
        required: false,
      },
    ],
  },
  {
    handle: "OFFLINE_MODE",
    group: "Network",
    tab: "Network",
    systemKey: false,
    writeKey: "Set offline mode status",
    readKey: "Get offline mode status",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Offline Mode",
        responseDataKey: "Parameter values",
        colspan: 4,
        required: true,
        options: [
          {
            value: 0,
            label: "Off",
          },
          {
            value: 1,
            label: "On",
          },
        ],
      },
    ],
  },
  // {
  //   handle: "GPRS",
  //   group: "Network",
  //   tab: "Network",
  //   systemKey: false,
  //   writeKey: "Set GPRS mode status",
  //   readKey: "Get GPRS parameters",
  //   permissions: {
  //     user: "rw",
  //     installer: "rw",
  //     manufacturer: "rw",
  //   },
  //   inputs: [
  //     {
  //       displayName: "APN",
  //       responseDataKey: "APN",
  //       colspan: 4,
  //       required: true,
  //     },
  //     {
  //       displayName: "LTE Username",
  //       responseDataKey: "User",
  //       colspan: 4,
  //       required: true,
  //     },
  //     {
  //       displayName: "LTE Password",
  //       responseDataKey: "Password",
  //       colspan: 4,
  //       required: true,
  //     },
  //   ],
  // },
  // {
  //   handle: "TAMPER",
  //   group: "Specifications",
  //   tab: "Specifications",
  //   systemKey: false,
  //   writeKey: "Set Tamper Enable",
  //   readKey: "Get Tamper Enable",
  //   permissions: {
  //     user: "rw",
  //     installer: "rw",
  //     manufacturer: "rw",
  //   },
  //   inputs: [
  //     {
  //       displayName: "Tamper Enabled",
  //       responseDataKey: "Parameter values",
  //       colspan: 2,
  //       required: true,
  //       options: [
  //         {
  //           value: 0,
  //           label: "No",
  //         },
  //         {
  //           value: 1,
  //           label: "Yes",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   handle: "SOLARCT",
  //   group: "Specifications",
  //   tab: "Specifications",
  //   systemKey: false,
  //   writeKey: "Set SolarCT Enable",
  //   readKey: "Get SolarCT Enable",
  //   permissions: {
  //     user: "rw",
  //     installer: "rw",
  //     manufacturer: "rw",
  //   },
  //   inputs: [
  //     {
  //       displayName: "Solar CT Installed",
  //       responseDataKey: "Parameter values",
  //       colspan: 2,
  //       required: true,
  //       options: [
  //         {
  //           value: 0,
  //           label: "No",
  //         },
  //         {
  //           value: 1,
  //           label: "Yes",
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    handle: "GRIDCT",
    group: "Specifications",
    tab: "Specifications",
    systemKey: false,
    writeKey: "Set dynamic load balancing working mode",
    readKey: "Get dynamic load balancing working mode",
    permissions: {
      user: "rw",
      installer: "rw",
      manufacturer: "rw",
    },
    inputs: [
      {
        displayName: "Grid CT Installed",
        responseDataKey: "Parameter values",
        colspan: 2,
        required: true,
        options: [
          {
            value: 0,
            label: "No",
          },
          {
            value: 1,
            label: "Yes",
          },
        ],
        conditionalSettings: [
          {
            value: 0,
            settings: [
              {
                handle: "GRIDCTCOMMMODE",
                value: [
                  {
                    responseDataKey: "Parameter values",
                    value: "null",
                  },
                ],
              },
            ],
          },
          {
            value: 1,
            settings: [
              {
                handle: "GRIDCTCOMMMODE",
                value: [
                  {
                    responseDataKey: "Parameter values",
                    value: "ht7017",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    handle: "GRIDCTCOMMMODE",
    group: "Conditional",
    tab: "Conditional",
    systemKey: true,
    writeKey: "Set dynamic load balancing communication mode",
    readKey: "Get dynamic load balancing communication mode",
    permissions: {
      user: "w",
      installer: "w",
      manufacturer: "w",
    },
    inputs: [
      {
        displayName: "Dynamic Load Balancing",
        responseDataKey: "Parameter values",
        colspan: 2,
        required: true,
        options: [
          {
            value: "null",
            label: "Off",
          },
          {
            value: "ht7017",
            label: "On",
          },
        ],
      },
    ],
  },
  {
    handle: "STARTSTOPCHARGE",
    group: "Test",
    tab: "Test",
    systemKey: true,
    writeKey: "Start and stop charging",
    readKey: "Start and stop charging",
    permissions: {
      user: "w",
      installer: "w",
      manufacturer: "w",
    },
    inputs: [
      {
        displayName: "Results",
        responseDataKey: "Results",
        colspan: 1,
        required: true,
      },
    ],
  },
];

export default schema;
