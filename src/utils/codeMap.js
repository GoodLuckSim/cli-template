
const data = {
  'supplierType': {
    '1': 'Insurance Company',
    '2': 'Broker Company'
  },
  'companyType': {
    '1': 'Insurance Company',
    '2': 'Broker Company',
    '3': 'General Company'
  },
  'distributorCategory': {
    '1': 'Partner Ship',
    '2': 'Channel'
  },
  'UPDStatus': {
    '-1': 'Frozen',
    '0': 'Unsubmit',
    '1': 'Pending',
    '2': 'Approved',
    '3': 'Active',
    '4': 'Declined'
  },
  'inscoSpecialBonusReceiver': {
    '1': 'Distributor',
    '2': 'Supplier'
  },
  'binderType': {
    '1': 'Binder',
    '2': 'non-binder'
  },
  'orderType': {
    1: 'New Policy',
    2: 'Endorsement',
    3: 'Renewal'
  },
  'creatorType': {
    1: 'Partner',
    2: 'Customer',
    3: 'API',
    4: 'Backend'
  },
  'bizModel': {
    1: 'Partner',
    2: 'Channel',
    3: 'Platform'
  },
  'policyType': {
    1: 'Binder',
    2: 'Non-Binder'
  },
  'appPlatform': {
    1: 'Android',
    2: 'iOS',
    3: 'Pad',
    4: 'PC',
    5: 'H5'
  },
  'purchaserType': {
    1: 'Partner',
    2: 'Fuse Staff'
  },
  'orderStatus': {
    1: 'Not Submit',
    2: 'Preliminary Review',
    3: 'Underwriting',
    4: 'Approval',
    5: 'Declined',
    6: 'Invalid'
  },
  'policyStatus': {
    0: '-',
    1: 'Inactive',
    2: 'Effective',
    3: 'Inoperative',
    4: 'Surrender'
  },
  'paymentStatus': {
    1: 'Unpaid',
    2: 'Pending',
    3: 'Paid',
    4: 'Refunded'
  },
  'gender': {
    0: 'Female',
    1: 'Male',
    2: 'Others'
  },
  'partnerStatus': {
    0: 'Blocked',
    1: 'Unblocked'
  },
  'generationIdCardStatus': {
    '-1': ' Not Submit',
    0: 'Pending',
    1: 'Pass',
    2: 'Failed'
  },
  'idCardAuthenticationStatus': {
    '-2': 'Not Submit',
    '-1': 'Not Submit',
    0: 'Pending',
    1: 'Pass',
    2: 'Failed',
    3: 'Failed'
  },
  'accountType': {
    '1': 'Normal Account',
    '2': 'Test Account'
  }
}
export function codeMap(key) {
  return data
}
