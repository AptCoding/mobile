interface PropertyData {
  characteristicId: string;
  description: string;
  messageCode: string;
  messageType: string;
  type?: string;
  permissions?: PermissionsSchema;
  required?: boolean;
  dataLength: number;
  maxLength?: number;
  systemKey?: boolean;
  rebootRequired?: boolean;
  data?: Record<string, ResponseDataItem>;
}

interface PermissionsSchema {
  user: string;
  installer: string;
  manufacturer: string;
}

interface ResponseDataItem {
  type: string;
  length: number;
}

interface Protocol {
  title: string;
  minFirmwareVersion: string;
  properties: Record<string, PropertyData>;
}

const eProtocol: Protocol = {
  title: "EVBEE BLEConfigurationProperties",
  minFirmwareVersion: "1.0.0",
  properties: {
    "Device information query": {
      characteristicId: "01000000-0000-0000-0000-000000000000",
      description: "Device information query",
      messageCode: "0100",
      messageType: "request",
      type: "string",
      required: true,
      dataLength: 12,
      systemKey: true,
    },
    "Device information query response": {
      characteristicId: "02000000-0000-0000-0000-000000000000",
      description: "Device information query",
      messageCode: "0200",
      messageType: "response",
      type: "string",
      required: true,
      dataLength: 80,
      systemKey: true,
      data: {
        "Protocol version number": {
          type: "string",
          length: 4,
        },
        "fw version": {
          type: "string",
          length: 20,
        },
        "pcb number": {
          type: "string",
          length: 20,
        },
        "SN Number": {
          type: "string",
          length: 20,
        },
        "device type": {
          type: "string",
          length: 16,
        },
      },
    },
    "Device password authentication": {
      characteristicId: "03000000-0000-0000-0000-000000000000",
      description: "Device password authentication",
      messageCode: "0300",
      messageType: "request",
      type: "string",
      required: true,
      dataLength: 8,
      systemKey: true,
    },
    "Device password authentication response": {
      characteristicId: "04000000-0000-0000-0000-000000000000",
      description: "Device password authentication response",
      messageCode: "0400",
      messageType: "response",
      type: "string",
      required: true,
      dataLength: 4,
      systemKey: true,
      data: {
        "Lock time": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Device password modification": {
      characteristicId: "05000000-0000-0000-0000-000000000000",
      description: "Device password modification",
      messageCode: "0500",
      messageType: "request",
      type: "string",
      required: true,
      dataLength: 8,
      rebootRequired: true,
      systemKey: false,
    },
    "Device password modification response": {
      characteristicId: "06000000-0000-0000-0000-000000000000",
      description: "Device password modification response",
      messageCode: "0600",
      messageType: "response",
      type: "string",
      required: true,
      dataLength: 4,
      rebootRequired: true,
      systemKey: false,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Device heartbeat test": {
      characteristicId: "07000000-0000-0000-0000-000000000000",
      description: "Device heartbeat test",
      messageCode: "0700",
      messageType: "request",
      type: "string",
      permissions: {
        user: "r",
        installer: "r",
        manufacturer: "r",
      },
      dataLength: 4,
      systemKey: false,
    },
    "Device heartbeat test response": {
      characteristicId: "08000000-0000-0000-0000-000000000000",
      description: "Device heartbeat test response",
      messageCode: "0800",
      messageType: "response",
      type: "string",
      permissions: {
        user: "r",
        installer: "r",
        manufacturer: "r",
      },
      dataLength: 4,
      systemKey: false,
      data: {
        "Reply data": {
          type: "string",
          length: 4,
        },
      },
    },
    "Set power type": {
      characteristicId: "11000000-0000-0000-0000-000000000000",
      description: "Set power type",
      messageCode: "1100",
      messageType: "request",
      type: "string",
      permissions: {
        user: "r",
        installer: "r",
        manufacturer: "r",
      },
      dataLength: 4,
      systemKey: false,
    },
    "Set power type response": {
      characteristicId: "12000000-0000-0000-0000-000000000000",
      description: "Set power type response",
      messageCode: "1200",
      messageType: "response",
      type: "string",
      permissions: {
        user: "r",
        installer: "r",
        manufacturer: "r",
      },
      dataLength: 4,
      systemKey: false,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set current parameter": {
      characteristicId: "13000000-0000-0000-0000-000000000000",
      description: "Set current parameter",
      messageCode: "1300",
      messageType: "request",
      type: "string",
      permissions: {
        user: "r",
        installer: "r",
        manufacturer: "r",
      },
      dataLength: 4,
      systemKey: false,
    },
    "Set current parameter response": {
      characteristicId: "14000000-0000-0000-0000-000000000000",
      description: "Set current parameter response",
      messageCode: "1400",
      messageType: "response",
      type: "string",
      permissions: {
        user: "r",
        installer: "r",
        manufacturer: "r",
      },
      dataLength: 4,
      systemKey: false,
      data: {
        "Parameter type": {
          type: "integer",
          length: 2,
        },
        "Parameter values": {
          type: "integer",
          length: 2,
        },
      },
    },
    "Set FreeCharging mode": {
      characteristicId: "15000000-0000-0000-0000-000000000000",
      description: "Set FreeCharging mode",
      messageCode: "1500",
      messageType: "request",
      type: "string",
      permissions: {
        user: "r",
        installer: "r",
        manufacturer: "rw",
      },
      dataLength: 4,
      systemKey: false,
    },
    "Set FreeCharging mode response": {
      characteristicId: "16000000-0000-0000-0000-000000000000",
      description: "Set FreeCharging mode response",
      messageCode: "1600",
      messageType: "response",
      type: "string",
      permissions: {
        user: "r",
        installer: "r",
        manufacturer: "rw",
      },
      dataLength: 4,
      systemKey: false,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set FreeCharging IdTag": {
      characteristicId: "17000000-0000-0000-0000-000000000000",
      description: "Set FreeCharging IdTag",
      messageCode: "1700",
      messageType: "request",
      dataLength: 20,
    },
    "Set FreeCharging IdTag response": {
      characteristicId: "18000000-0000-0000-0000-000000000000",
      description: "Set FreeCharging IdTag",
      messageCode: "1800",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set network mode": {
      characteristicId: "19000000-0000-0000-0000-000000000000",
      description: "Set network mode",
      messageCode: "1900",
      messageType: "request",
      rebootRequired: true,
      dataLength: 4,
    },
    "Set network mode response": {
      characteristicId: "1a000000-0000-0000-0000-000000000000",
      description: "Set network mode",
      messageCode: "1a00",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set WIFI parameters": {
      characteristicId: "1b000000-0000-0000-0000-000000000000",
      description: "Set WIFI parameters",
      messageCode: "1b00",
      messageType: "request",
      rebootRequired: true,
      dataLength: 64,
    },
    "Set WIFI parameters response": {
      characteristicId: "1c000000-0000-0000-0000-000000000000",
      description: "Set WIFI parameters",
      messageCode: "1c00",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set OCPP URL": {
      characteristicId: "1d000000-0000-0000-0000-000000000000",
      description: "Set OCPP URL",
      messageCode: "1d00",
      messageType: "request",
      rebootRequired: true,
      dataLength: 128,
    },
    "Set OCPP URL response": {
      characteristicId: "1e000000-0000-0000-0000-000000000000",
      description: "Set OCPP URL",
      messageCode: "1e00",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set OCPP ChargerID": {
      characteristicId: "1f000000-0000-0000-0000-000000000000",
      description: "Set OCPP ChargerID",
      messageCode: "1f00",
      messageType: "request",
      rebootRequired: true,
      dataLength: 28,
    },
    "Set OCPP ChargerID response": {
      characteristicId: "20000000-0000-0000-0000-000000000000",
      description: "Set OCPP ChargerID",
      messageCode: "2000",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set HTTP Basic Authentication account": {
      characteristicId: "21000000-0000-0000-0000-000000000000",
      description: "Set HTTP Basic Authentication account",
      messageCode: "2100",
      messageType: "request",
      rebootRequired: true,
      dataLength: 32,
    },
    "Set HTTP Basic Authentication account response": {
      characteristicId: "22000000-0000-0000-0000-000000000000",
      description: "Set HTTP Basic Authentication account",
      messageCode: "2200",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set HTTP Basic Authentication password": {
      characteristicId: "23000000-0000-0000-0000-000000000000",
      description: "Set HTTP Basic Authentication password",
      messageCode: "2300",
      messageType: "request",
      rebootRequired: true,
      dataLength: 32,
    },
    "Set HTTP Basic Authentication password response": {
      characteristicId: "24000000-0000-0000-0000-000000000000",
      description: "Set HTTP Basic Authentication password",
      messageCode: "2400",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set random delay time": {
      characteristicId: "25000000-0000-0000-0000-000000000000",
      description: "Set random delay time",
      messageCode: "2500",
      messageType: "request",
      dataLength: 4,
    },
    "Set random delay time response": {
      characteristicId: "26000000-0000-0000-0000-000000000000",
      description: "Set random delay time",
      messageCode: "2600",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set off-peak schedule": {
      characteristicId: "27000000-0000-0000-0000-000000000000",
      description: "Set off-peak schedule",
      messageCode: "2700",
      messageType: "request",
      dataLength: 112,
    },
    "Set off-peak schedule response": {
      characteristicId: "28000000-0000-0000-0000-000000000000",
      description: "Set off-peak schedule",
      messageCode: "2800",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set dynamic load balancing communication mode": {
      characteristicId: "29000000-0000-0000-0000-000000000000",
      description: "Set dynamic load balancing communication mode",
      messageCode: "2900",
      messageType: "request",
      dataLength: 16,
    },
    "Set dynamic load balancing communication mode response": {
      characteristicId: "2a000000-0000-0000-0000-000000000000",
      description: "Set dynamic load balancing communication mode",
      messageCode: "2a00",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set dynamic load balancing minimum current": {
      characteristicId: "2b000000-0000-0000-0000-000000000000",
      description: "Set dynamic load balancing minimum current",
      messageCode: "2b00",
      messageType: "request",
      dataLength: 4,
    },
    "Set dynamic load balancing minimum current response": {
      characteristicId: "2c000000-0000-0000-0000-000000000000",
      description: "Set dynamic load balancing minimum current",
      messageCode: "2c00",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set dynamic load balancing phase switching": {
      characteristicId: "2d000000-0000-0000-0000-000000000000",
      description: "Set dynamic load balancing phase switching",
      messageCode: "2d00",
      messageType: "request",
      dataLength: 4,
    },
    "Set dynamic load balancing phase switching response": {
      characteristicId: "2e000000-0000-0000-0000-000000000000",
      description: "Set dynamic load balancing phase switching",
      messageCode: "2e00",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set dynamic load balancing working mode": {
      characteristicId: "2f000000-0000-0000-0000-000000000000",
      description: "Set dynamic load balancing working mode",
      messageCode: "2f00",
      messageType: "request",
      dataLength: 4,
    },
    "Set dynamic load balancing working mode response": {
      characteristicId: "30000000-0000-0000-0000-000000000000",
      description: "Set dynamic load balancing working mode",
      messageCode: "3000",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set charger lock mode": {
      characteristicId: "31000000-0000-0000-0000-000000000000",
      description: "Set charger lock mode",
      messageCode: "3100",
      messageType: "request",
      dataLength: 4,
    },
    "Set charger lock mode response": {
      characteristicId: "32000000-0000-0000-0000-000000000000",
      description: "Set charger lock mode",
      messageCode: "3200",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set administrator card": {
      characteristicId: "33000000-0000-0000-0000-000000000000",
      description: "Set administrator card",
      messageCode: "3300",
      messageType: "request",
      dataLength: 12,
    },
    "Set administrator card response": {
      characteristicId: "34000000-0000-0000-0000-000000000000",
      description: "Set administrator card",
      messageCode: "3400",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set device installation status": {
      characteristicId: "35000000-0000-0000-0000-000000000000",
      description: "Set device installation status",
      messageCode: "3500",
      messageType: "request",
      dataLength: 28,
    },
    "Set device installation status response": {
      characteristicId: "36000000-0000-0000-0000-000000000000",
      description: "Set device installation status",
      messageCode: "3600",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set offline mode status": {
      characteristicId: "37000000-0000-0000-0000-000000000000",
      description: "Set offline mode status",
      messageCode: "3700",
      messageType: "request",
      dataLength: 4,
    },
    "Set offline mode status response": {
      characteristicId: "38000000-0000-0000-0000-000000000000",
      description: "Set offline mode status",
      messageCode: "3800",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set GPRS mode status": {
      characteristicId: "39000000-0000-0000-0000-000000000000",
      description: "Set GPRS mode status",
      messageCode: "3900",
      messageType: "request",
      rebootRequired: true,
      dataLength: 96,
    },
    "Set GPRS mode status response": {
      characteristicId: "3a000000-0000-0000-0000-000000000000",
      description: "Set GPRS mode status",
      messageCode: "3a00",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get power type": {
      characteristicId: "01020000-0000-0000-0000-000000000000",
      description: "Get power type",
      messageCode: "0102",
      messageType: "request",
      dataLength: 0,
    },
    "Get power type response": {
      characteristicId: "02020000-0000-0000-0000-000000000000",
      description: "Get power type",
      messageCode: "0202",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get current parameters": {
      characteristicId: "03020000-0000-0000-0000-000000000000",
      description: "Get current parameters",
      messageCode: "0302",
      messageType: "request",
      dataLength: 4,
    },
    "Get current parameters response": {
      characteristicId: "04020000-0000-0000-0000-000000000000",
      description: "Get current parameters",
      messageCode: "0402",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter type": {
          type: "integer",
          length: 2,
        },
        "Parameter values": {
          type: "integer",
          length: 2,
        },
      },
    },
    "Get FreeCharging mode": {
      characteristicId: "05020000-0000-0000-0000-000000000000",
      description: "Get FreeCharging mode",
      messageCode: "0502",
      messageType: "request",
      dataLength: 0,
    },
    "Get FreeCharging mode response": {
      characteristicId: "06020000-0000-0000-0000-000000000000",
      description: "Get FreeCharging mode",
      messageCode: "0602",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get FreeCharging IdTag": {
      characteristicId: "07020000-0000-0000-0000-000000000000",
      description: "Get FreeCharging IdTag",
      messageCode: "0702",
      messageType: "request",
      dataLength: 0,
    },

    "Get FreeCharging IdTag response": {
      characteristicId: "08020000-0000-0000-0000-000000000000",
      description: "Get FreeCharging IdTag",
      messageCode: "0802",
      messageType: "response",
      dataLength: 20,
      data: {
        IdTag: {
          type: "string",
          length: 20,
        },
      },
    },
    "Get network mode": {
      characteristicId: "09020000-0000-0000-0000-000000000000",
      description: "Get network mode",
      messageCode: "0902",
      messageType: "request",
      dataLength: 0,
    },
    "Get network mode response": {
      characteristicId: "0a020000-0000-0000-0000-000000000000",
      description: "Get network mode",
      messageCode: "0a02",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 20,
        },
      },
    },
    "Get WIFI parameters": {
      characteristicId: "0b020000-0000-0000-0000-000000000000",
      description: "Get WIFI parameters",
      messageCode: "0b02",
      messageType: "request",
      dataLength: 0,
    },
    "Get WIFI parameters response": {
      characteristicId: "0c020000-0000-0000-0000-000000000000",
      description: "Get WIFI parameters",
      messageCode: "0c02",
      messageType: "response",
      dataLength: 64,
      data: {
        SSID: {
          type: "string",
          length: 32,
        },
        Password: {
          type: "string",
          length: 32,
        },
      },
    },
    "Get OCPP URL": {
      characteristicId: "0d020000-0000-0000-0000-000000000000",
      description: "Get OCPP URL",
      messageCode: "0d02",
      messageType: "request",
      dataLength: 0,
    },
    "Get OCPP URL response": {
      description: "Get OCPP URL",
      characteristicId: "0e020000-0000-0000-0000-000000000000",
      messageCode: "0e02",
      messageType: "response",
      dataLength: 128,
      data: {
        URL: {
          type: "string",
          length: 128,
        },
      },
    },
    "Get OCPP ChargerID": {
      description: "Get OCPP ChargerID",
      characteristicId: "0f020000-0000-0000-0000-000000000000",
      messageCode: "0f02",
      messageType: "request",
      dataLength: 0,
    },
    "Get OCPP ChargerID response": {
      characteristicId: "10020000-0000-0000-0000-000000000000",
      description: "Get OCPP ChargerID",
      messageCode: "1002",
      messageType: "response",
      dataLength: 28,
      data: {
        "Charger ID": {
          type: "string",
          length: 28,
        },
      },
    },
    "Get HTTP Basic Authentication account": {
      characteristicId: "11020000-0000-0000-0000-000000000000",
      description: "Get HTTP Basic Authentication account",
      messageCode: "1102",
      messageType: "request",
      dataLength: 0,
    },
    "Get HTTP Basic Authentication account response": {
      characteristicId: "12020000-0000-0000-0000-000000000000",
      description: "Get HTTP Basic Authentication account",
      messageCode: "1202",
      messageType: "response",
      dataLength: 32,
      data: {
        Account: {
          type: "string",
          length: 32,
        },
      },
    },
    "Get HTTP Basic Authentication password": {
      characteristicId: "13020000-0000-0000-0000-000000000000",
      description: "Get HTTP Basic Authentication password",
      messageCode: "1302",
      messageType: "request",
      dataLength: 0,
    },
    "Get HTTP Basic Authentication password response": {
      characteristicId: "14020000-0000-0000-0000-000000000000",
      description: "Get HTTP Basic Authentication password",
      messageCode: "1402",
      messageType: "response",
      dataLength: 32,
      data: {
        Password: {
          type: "string",
          length: 32,
        },
      },
    },
    "Get random delay time": {
      characteristicId: "15020000-0000-0000-0000-000000000000",
      description: "Get random delay time",
      messageCode: "1502",
      messageType: "request",
      dataLength: 0,
    },
    "Get random delay time response": {
      characteristicId: "16020000-0000-0000-0000-000000000000",
      description: "Get random delay time",
      messageCode: "1602",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get off-peak schedule": {
      characteristicId: "17020000-0000-0000-0000-000000000000",
      description: "Get off-peak schedule",
      messageCode: "1702",
      messageType: "request",
      dataLength: 0,
    },
    "Get off-peak schedule response": {
      characteristicId: "18020000-0000-0000-0000-000000000000",
      description: "Get off-peak schedule",
      messageCode: "1802",
      messageType: "response",
      dataLength: 112,
      data: {
        "(Mon.) Number of valid periods": { type: "integer", length: 4 },
        "(Mon.) Start time of period 1": { type: "integer", length: 2 },
        "(Mon.) Duration of period 1": { type: "integer", length: 2 },
        "(Mon.) Start time of period 2": { type: "integer", length: 2 },
        "(Mon.) Duration of period 2": { type: "integer", length: 2 },
        "(Mon.) Start time of period 3": { type: "integer", length: 2 },
        "(Mon.) Duration of period 3": { type: "integer", length: 2 },
        "(Tues.) Number of valid periods": { type: "integer", length: 4 },
        "(Tues.) Start time of period 1": { type: "integer", length: 2 },
        "(Tues.) Duration of period 1": { type: "integer", length: 2 },
        "(Tues.) Start time of period 2": { type: "integer", length: 2 },
        "(Tues.) Duration of period 2": { type: "integer", length: 2 },
        "(Tues.) Start time of period 3": { type: "integer", length: 2 },
        "(Tues.) Duration of period 3": { type: "integer", length: 2 },
        "(Wed.) Number of valid periods": { type: "integer", length: 4 },
        "(Wed.) Start time of period 1": { type: "integer", length: 2 },
        "(Wed.) Duration of period 1": { type: "integer", length: 2 },
        "(Wed.) Start time of period 2": { type: "integer", length: 2 },
        "(Wed.) Duration of period 2": { type: "integer", length: 2 },
        "(Wed.) Start time of period 3": { type: "integer", length: 2 },
        "(Wed.) Duration of period 3": { type: "integer", length: 2 },
        "(Thur.) Number of valid periods": { type: "integer", length: 4 },
        "(Thur.) Start time of period 1": { type: "integer", length: 2 },
        "(Thur.) Duration of period 1": { type: "integer", length: 2 },
        "(Thur.) Start time of period 2": { type: "integer", length: 2 },
        "(Thur.) Duration of period 2": { type: "integer", length: 2 },
        "(Thur.) Start time of period 3": { type: "integer", length: 2 },
        "(Thur.) Duration of period 3": { type: "integer", length: 2 },
        "(Fri.) Number of valid periods": { type: "integer", length: 4 },
        "(Fri.) Start time of period 1": { type: "integer", length: 2 },
        "(Fri.) Duration of period 1": { type: "integer", length: 2 },
        "(Fri.) Start time of period 2": { type: "integer", length: 2 },
        "(Fri.) Duration of period 2": { type: "integer", length: 2 },
        "(Fri.) Start time of period 3": { type: "integer", length: 2 },
        "(Fri.) Duration of period 3": { type: "integer", length: 2 },
        "(Sat.) Number of valid periods": { type: "integer", length: 4 },
        "(Sat.) Start time of period 1": { type: "integer", length: 2 },
        "(Sat.) Duration of period 1": { type: "integer", length: 2 },
        "(Sat.) Start time of period 2": { type: "integer", length: 2 },
        "(Sat.) Duration of period 2": { type: "integer", length: 2 },
        "(Sat.) Start time of period 3": { type: "integer", length: 2 },
        "(Sat.) Duration of period 3": { type: "integer", length: 2 },
        "(Sun.) Number of valid periods": { type: "integer", length: 4 },
        "(Sun.) Start time of period 1": { type: "integer", length: 2 },
        "(Sun.) Duration of period 1": { type: "integer", length: 2 },
        "(Sun.) Start time of period 2": { type: "integer", length: 2 },
        "(Sun.) Duration of period 2": { type: "integer", length: 2 },
        "(Sun.) Start time of period 3": { type: "integer", length: 2 },
        "(Sun.) Duration of period 3": { type: "integer", length: 2 },
      },
    },
    "Get dynamic load balancing communication mode": {
      characteristicId: "19020000-0000-0000-0000-000000000000",
      description: "Get dynamic load balancing communication mode",
      messageCode: "1902",
      messageType: "request",
      dataLength: 0,
    },
    "Get dynamic load balancing communication mode response": {
      characteristicId: "00000000-0000-0000-0000-000000000000",
      description: "Get dynamic load balancing communication mode",
      messageCode: "1a02",
      messageType: "response",
      dataLength: 16,
      data: {
        "Parameter values": {
          type: "string",
          length: 16,
        },
      },
    },
    "Get dynamic load balancing minimum current": {
      characteristicId: "1b020000-0000-0000-0000-000000000000",
      description: "Get dynamic load balancing minimum current",
      messageCode: "1b02",
      messageType: "request",
      dataLength: 0,
    },
    "Get dynamic load balancing minimum current response": {
      characteristicId: "1c020000-0000-0000-0000-000000000000",
      description: "Get dynamic load balancing minimum current",
      messageCode: "1c02",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get dynamic load balancing phase switching": {
      characteristicId: "1d020000-0000-0000-0000-000000000000",
      description: "Get dynamic load balancing phase switching",
      messageCode: "1d02",
      messageType: "request",
      dataLength: 0,
    },
    "Get dynamic load balancing phase switching response": {
      characteristicId: "1e020000-0000-0000-0000-000000000000",
      description: "Get dynamic load balancing phase switching",
      messageCode: "1e02",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get dynamic load balancing working mode": {
      characteristicId: "1f020000-0000-0000-0000-000000000000",
      description: "Get dynamic load balancing working mode",
      messageCode: "1f02",
      messageType: "request",
      dataLength: 0,
    },
    "Get dynamic load balancing working mode response": {
      characteristicId: "20020000-0000-0000-0000-000000000000",
      description: "Get dynamic load balancing working mode",
      messageCode: "2002",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get charger lock mode": {
      characteristicId: "21020000-0000-0000-0000-000000000000",
      description: "Get charger lock mode",
      messageCode: "2102",
      messageType: "request",
      dataLength: 0,
    },
    "Get charger lock mode response": {
      characteristicId: "22020000-0000-0000-0000-000000000000",
      description: "Get charger lock mode",
      messageCode: "2202",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get administrator card": {
      characteristicId: "23020000-0000-0000-0000-000000000000",
      description: "Get administrator card",
      messageCode: "2302",
      messageType: "request",
      dataLength: 4,
    },
    "Get administrator card response": {
      characteristicId: "24020000-0000-0000-0000-000000000000",
      description: "Get administrator card",
      messageCode: "2402",
      messageType: "response",
      dataLength: 12,
      data: {
        "Card index": {
          type: "integer",
          length: 4,
        },
        "Card ID": {
          type: "string",
          length: 8,
        },
      },
    },
    "Get device installation status": {
      characteristicId: "25020000-0000-0000-0000-000000000000",
      description: "Get device installation status",
      messageCode: "2502",
      messageType: "request",
      dataLength: 0,
    },
    "Get device installation status response": {
      characteristicId: "26020000-0000-0000-0000-000000000000",
      description: "Get device installation status",
      messageCode: "2602",
      messageType: "response",
      dataLength: 28,
      data: {
        "Parameter values": {
          type: "string",
          length: 28,
        },
      },
    },
    "Get offline mode status": {
      characteristicId: "27020000-0000-0000-0000-000000000000",
      description: "Get offline mode status",
      messageCode: "2702",
      messageType: "request",
      dataLength: 0,
    },
    "Get offline mode status response": {
      characteristicId: "28020000-0000-0000-0000-000000000000",
      description: "Get offline mode status",
      messageCode: "2802",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 28,
        },
      },
    },
    "Get GPRS parameters": {
      characteristicId: "29020000-0000-0000-0000-000000000000",
      description: "Get GPRS parameters",
      messageCode: "2902",
      messageType: "request",
      dataLength: 0,
    },
    "Get GPRS parameters response": {
      characteristicId: "2a020000-0000-0000-0000-000000000000",
      description: "Get GPRS parameters",
      messageCode: "2a02",
      messageType: "response",
      dataLength: 96,
      data: {
        APN: {
          type: "string",
          length: 32,
        },
        User: {
          type: "string",
          length: 32,
        },
        Password: {
          type: "string",
          length: 32,
        },
      },
    },
    "System reboot": {
      characteristicId: "01040000-0000-0000-0000-000000000000",
      description: "System reboot",
      messageCode: "0104",
      messageType: "request",
      dataLength: 0,
    },
    "System reboot response": {
      characteristicId: "02040000-0000-0000-0000-000000000000",
      description: "System reboot",
      messageCode: "0204",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Factory reset": {
      characteristicId: "03040000-0000-0000-0000-000000000000",
      description: "Factory reset",
      messageCode: "0304",
      messageType: "request",
      dataLength: 0,
    },
    "Factory reset response": {
      characteristicId: "04040000-0000-0000-0000-000000000000",
      description: "Factory reset",
      messageCode: "0404",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "WIFI hotspot search": {
      characteristicId: "05040000-0000-0000-0000-000000000000",
      description: "WIFI hotspot search",
      messageCode: "0504",
      messageType: "request",
      dataLength: 0,
    },
    "WIFI hotspot search response": {
      characteristicId: "06040000-0000-0000-0000-000000000000",
      description: "WIFI hotspot search",
      messageCode: "0604",
      messageType: "response",
      dataLength: 0,
      data: {
        "Available numbers": {
          type: "integer",
          length: 4,
        },
        "Parameter content": {
          type: "string",
          length: 0,
        },
      },
    },
    "Charger lock status": {
      characteristicId: "07040000-0000-0000-0000-000000000000",
      description: "Charger lock status",
      messageCode: "0704",
      messageType: "request",
      dataLength: 0,
    },
    "Charger lock status response": {
      characteristicId: "08040000-0000-0000-0000-000000000000",
      description: "Charger lock status",
      messageCode: "0804",
      messageType: "response",
      dataLength: 4,
      data: {
        "Current status": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Charger lock control": {
      characteristicId: "09040000-0000-0000-0000-000000000000",
      description: "Charger lock status",
      messageCode: "0904",
      messageType: "request",
      dataLength: 4,
    },
    "Charger lock control response": {
      characteristicId: "0a040000-0000-0000-0000-000000000000",
      description: "Charger lock status",
      messageCode: "0a04",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "OCPP connection status": {
      characteristicId: "0b040000-0000-0000-0000-000000000000",
      description: "OCPP connection status",
      messageCode: "0b04",
      messageType: "request",
      dataLength: 0,
    },
    "OCPP connection status response": {
      characteristicId: "0c040000-0000-0000-0000-000000000000",
      description: "OCPP connection status",
      messageCode: "0c04",
      messageType: "response",
      dataLength: 4,
      data: {
        "Communication status": {
          type: "integer",
          length: 2,
        },
        "Communication mode": {
          type: "string",
          length: 2,
        },
      },
    },
    "Network device status": {
      characteristicId: "0d040000-0000-0000-0000-000000000000",
      description: "Network device status",
      messageCode: "0d04",
      messageType: "request",
      dataLength: 4,
    },
    "Network device status response": {
      characteristicId: "0e040000-0000-0000-0000-000000000000",
      description: "Network device status",
      messageCode: "0e04",
      messageType: "response",
      dataLength: 40,
      data: {
        "Network device": {
          type: "integer",
          length: 1,
        },
        "Work status": {
          type: "integer",
          length: 1,
        },
        "Networking status": {
          type: "integer",
          length: 1,
        },
        "Signal strength": {
          type: "integer",
          length: 1,
        },
        "Device address": {
          type: "string",
          length: 20,
        },
        "IP address": {
          type: "string",
          length: 16,
        },
      },
    },
    "Dynamic load balancing data": {
      characteristicId: "0f040000-0000-0000-0000-000000000000",
      description: "Dynamic load balancing data",
      messageCode: "0f04",
      messageType: "request",
      dataLength: 0,
    },
    "Dynamic load balancing data response": {
      characteristicId: "10040000-0000-0000-0000-000000000000",
      description: "Dynamic load balancing data",
      messageCode: "1004",
      messageType: "response",
      dataLength: 20,
      data: {
        "Communication status": {
          type: "integer",
          length: 1,
        },
        "Signal strength ": {
          type: "integer",
          length: 1,
        },
        "Main line current (L1)": {
          type: "integer",
          length: 2,
        },
        "Main line current (L2)": {
          type: "integer",
          length: 2,
        },
        "Main line current (L3)": {
          type: "integer",
          length: 2,
        },
        "Main line voltage (L1)": {
          type: "integer",
          length: 2,
        },
        "Main line voltage (L2)": {
          type: "integer",
          length: 2,
        },
        "Main line voltage (L3)": {
          type: "integer",
          length: 2,
        },
        "Charger limiting current (L1)": {
          type: "integer",
          length: 2,
        },
        "Charger limiting current (L2)": {
          type: "integer",
          length: 2,
        },
        "Charger limiting current (L3)": {
          type: "integer",
          length: 2,
        },
      },
    },
    "Start and stop charging": {
      characteristicId: "11040000-0000-0000-0000-000000000000",
      description: "Start and stop charging",
      messageCode: "1104",
      messageType: "request",
      dataLength: 24,
    },
    "Start and stop charging response": {
      characteristicId: "12040000-0000-0000-0000-000000000000",
      description: "Start and stop charging",
      messageCode: "1204",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Charging data query": {
      characteristicId: "13040000-0000-0000-0000-000000000000",
      description: "Charging data query",
      messageCode: "1304",
      messageType: "request",
      dataLength: 0,
    },
    "Charging data query response": {
      characteristicId: "14040000-0000-0000-0000-000000000000",
      description: "Charging data query",
      messageCode: "1404",
      messageType: "response",
      dataLength: 32,
      data: {
        "Connection status": {
          type: "integer",
          length: 1,
        },
        "Working status": {
          type: "integer",
          length: 1,
        },
        "Fault code": {
          type: "integer",
          length: 2,
        },
        "Current (L1)": {
          type: "integer",
          length: 2,
        },
        "Current (L2)": {
          type: "integer",
          length: 2,
        },
        "Current (L3)": {
          type: "integer",
          length: 2,
        },
        "Voltage (L1)": {
          type: "integer",
          length: 2,
        },
        "Voltage (L2)": {
          type: "integer",
          length: 2,
        },
        "Voltage (L3)": {
          type: "integer",
          length: 2,
        },
        meterRegister: {
          type: "integer",
          length: 4,
        },
        timestamp: {
          type: "integer",
          length: 4,
        },
        meterStart: {
          type: "integer",
          length: 4,
        },
        timeStart: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Charging record query": {
      characteristicId: "15040000-0000-0000-0000-000000000000",
      description: "Charging record query",
      messageCode: "1504",
      messageType: "request",
      dataLength: 4,
    },
    "Charging record query response": {
      characteristicId: "16040000-0000-0000-0000-000000000000",
      description: "Charging record query",
      messageCode: "1604",
      messageType: "response",
      dataLength: 72,
      data: {
        Index: {
          type: "integer",
          length: 2,
        },
        "Total number": {
          type: "integer",
          length: 2,
        },
        "Starting mode": {
          type: "integer",
          length: 2,
        },
        "Stop Reason": {
          type: "integer",
          length: 2,
        },
        IdTag: {
          type: "string",
          length: 20,
        },
        "Serial number": {
          type: "string",
          length: 28,
        },
        meterStart: {
          type: "integer",
          length: 4,
        },
        meterStop: {
          type: "integer",
          length: 4,
        },
        timeStart: {
          type: "integer",
          length: 4,
        },
        timeStop: {
          type: "integer",
          length: 4,
        },
      },
    },
    "SIM information query": {
      characteristicId: "17040000-0000-0000-0000-000000000000",
      description: "SIM information query",
      messageCode: "1704",
      messageType: "request",
      dataLength: 0,
    },
    "SIM information query response": {
      characteristicId: "18040000-0000-0000-0000-000000000000",
      description: "SIM information query",
      messageCode: "1804",
      messageType: "response",
      dataLength: 40,
      data: {
        IMSI: {
          type: "string",
          length: 16,
        },
        ICCID: {
          type: "string",
          length: 24,
        },
      },
    },
    "Firmware upgrade": {
      characteristicId: "01060000-0000-0000-0000-000000000000",
      description: "Firmware upgrade",
      messageCode: "0106",
      messageType: "request",
      dataLength: 24,
    },
    "Firmware upgrade response": {
      characteristicId: "02060000-0000-0000-0000-000000000000",
      description: "Firmware upgrade",
      messageCode: "0206",
      messageType: "response",
      dataLength: 4,
    },
    "Firmware block request": {
      characteristicId: "00000000-0000-0000-0000-000000000000",
      description: "Firmware block request by the device",
      messageCode: "0306",
      messageType: "request",
      dataLength: 24,
    },
    "Firmware block response": {
      characteristicId: "00000000-0000-0000-0000-000000000000",
      description: "Firmware block response from the app",
      messageCode: "0406",
      messageType: "response",
      dataLength: 512,
    },
    "Firmware process": {
      characteristicId: "00000000-0000-0000-0000-000000000000",
      description: "Firmware process",
      messageCode: "0506",
      messageType: "response",
      dataLength: 3,
      data: {
        percentage: {
          type: "integer",
          length: 3,
        },
      },
    },
    "Set SolarCT Enable": {
      characteristicId: "3d000000-0000-0000-0000-000000000000",
      description: "Set SolarCT Enable",
      messageCode: "3d00",
      messageType: "request",
      dataLength: 4,
    },
    "Set SolarCT Enable response": {
      characteristicId: "3e000000-0000-0000-0000-000000000000",
      description: "Set SolarCT Enable",
      messageCode: "3e00",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get SolarCT Enable": {
      characteristicId: "2d020000-0000-0000-0000-000000000000",
      description: "Get SolarCT Enable",
      messageCode: "2d02",
      messageType: "request",
      dataLength: 0,
    },
    "Get SolarCT Enable response": {
      characteristicId: "2e020000-0000-0000-0000-000000000000",
      description: "Get SolarCT Enable",
      messageCode: "2e02",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
    "Set Tamper Enable": {
      characteristicId: "3b000000-0000-0000-0000-000000000000",
      description: "Set Tamper Enable",
      messageCode: "3b00",
      messageType: "request",
      dataLength: 4,
    },
    "Set Tamper Enable response": {
      characteristicId: "3c000000-0000-0000-0000-000000000000",
      description: "Set Tamper Enable",
      messageCode: "3c00",
      messageType: "response",
      dataLength: 4,
      data: {
        Results: {
          type: "integer",
          length: 4,
        },
      },
    },
    "Get Tamper Enable": {
      characteristicId: "2b020000-0000-0000-0000-000000000000",
      description: "Get Tamper Enable",
      messageCode: "2b02",
      messageType: "request",
      dataLength: 0,
    },
    "Get Tamper Enable response": {
      characteristicId: "2c020000-0000-0000-0000-000000000000",
      description: "Get Tamper Enable",
      messageCode: "2c02",
      messageType: "response",
      dataLength: 4,
      data: {
        "Parameter values": {
          type: "integer",
          length: 4,
        },
      },
    },
  },
};

export default eProtocol;
