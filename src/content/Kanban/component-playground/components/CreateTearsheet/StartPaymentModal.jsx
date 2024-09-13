import { CreateModal, pkg } from "@carbon/ibm-products";
import { UnorderedList,ListItem, RadioButton, RadioButtonGroup, TextInput } from "@carbon/react";
import { useState } from "react";

pkg.component.CreateModal = true;

const StartPaymentModal = ({ openPayment, actions }) => {
    const [textInput, setTextInput] = useState("");
    const [invalid, setInvalid] = useState(false);
    const paymentOptions = {
        "head": {
            "requestId": null,
            "responseTimestamp": "1596023582343",
            "version": "v2"
        },
        "body": {
            "resultInfo": {
                "resultStatus": "S",
                "resultCode": "0000",
                "resultMsg": "Success"
            },
            "merchantDetails": {
                "mcc": "8398",
                "merchantVpa": "test-merchant@paytm",
                "merchantName": "Test Merchant",
                "merchantLogo": "https://merchant-static.paytm.com/merchant-dashboard/logo/INTEGR7769XXXXXX9383/org/logo"
            },
            "addMoneyMerchantDetails": {
                "mcc": "6540",
                "merchantVpa": "testadd-money@paytm",
                "merchantName": "Paytm Add Money",
                "merchantLogo": null
            },
            "walletOnly": false,
            "zeroCostEmi": false,
            "pcfEnabled": false,
            "nativeJsonRequestSupported": true,
            "activeMerchant": true,
            "addMoneyDestination": "MAIN",
            "oneClickMaxAmount": "2000",
            "userDetails": {
                "email": "testuser@gmail.com",
                "paytmCCEnabled": false,
                "kyc": false,
                "username": "Test Merchant",
                "mobile": "7777777777"
            },
            "loginInfo": {
                "userLoggedIn": true,
                "pgAutoLoginEnabled": false,
                "mobileNumberNonEditable": false
            },
            "iconBaseUrl": "https://staticgw1.paytm.in/native/bank/",
            "addDescriptionMandatory": false,
            "onTheFlyKYCRequired": false,
            "paymentFlow": "ADDANDPAY",
            "merchantPayOption": {
                "savedMandateBanks": null,
                "paymentModes": [{
                        "displayName": "Paytm Balance",
                        "payChannelOptions": [{
                            "iconUrl": null,
                            "balanceInfo": {
                                "subWalletDetails": null,
                                "accountBalance": {
                                    "currency": "INR",
                                    "value": "0.00"
                                },
                                "payerAccountExists": true
                            },
                            "isHybridDisabled": false
                        }],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "onboarding": false,
                        "paymentMode": "BALANCE",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "Rawat Voucher",
                        "payChannelOptions": [
    
                        ],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "storeFrontUrl": "paytmmp://homepage?url=https://storefront.paytm.com/v2/mobile/mystore?kybid=INTEGR7769XXXXXX9383&isMGV=true",
                        "onboarding": false,
                        "paymentMode": "GIFT_VOUCHER",
                        "isHybridDisabled": true
                    },
                    {
                        "displayName": "Net Banking",
                        "payChannelOptions": [{
                            "iconUrl": "AAXS.png",
                            "isHybridDisabled": false,
                            "channelCode": "AAXS",
                            "channelName": "AXIS"
                        }],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "onboarding": false,
                        "paymentMode": "NET_BANKING",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "Credit Card",
                        "payChannelOptions": [
    
                        ],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "prepaidCardSupported": false,
                        "onboarding": false,
                        "paymentMode": "CREDIT_CARD",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "Debit Card",
                        "payChannelOptions": [
    
                        ],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "prepaidCardSupported": false,
                        "onboarding": false,
                        "paymentMode": "DEBIT_CARD",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "BHIM UPI",
                        "payChannelOptions": [{
                                "iconUrl": "UPI.png",
                                "isHybridDisabled": false,
                                "channelCode": "UPI",
                                "channelName": "Unified Payment Interace"
                            },
                            {
                                "iconUrl": "UPIPUSH.png",
                                "isHybridDisabled": false,
                                "channelCode": "UPIPUSH",
                                "channelName": "Unified Payment Interface - PUSH"
                            },
                            {
                                "iconUrl": "UPIPUSHEXPRESS.png",
                                "isHybridDisabled": false,
                                "channelCode": "UPIPUSHEXPRESS",
                                "channelName": "Unified Payment Interface - PUSH Express"
                            }
                        ],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "onboarding": false,
                        "paymentMode": "UPI",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "Paytm Payments Bank",
                        "payChannelOptions": [{
                            "iconUrl": "PPBL.png",
                            "balanceInfo": null,
                            "isHybridDisabled": false
                        }],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "onboarding": false,
                        "paymentMode": "PPBL",
                        "isHybridDisabled": false
                    }
                ],
                "savedInstruments": [{
                    "iconUrl": "https://staticgw4.paytm.in/33.1.1/",
                    "oneClickSupported": false,
                    "cardDetails": {
                        "cardId": "6c11070XXXXXX1b9cac3489",
                        "cardType": "CREDIT_CARD",
                        "expiryDate": "012022",
                        "firstSixDigit": "411111",
                        "lastFourDigit": "1111",
                        "status": "1",
                        "cvvLength": "3",
                        "cvvRequired": true,
                        "indian": true
                    },
                    "issuingBank": "HDFC",
                    "isEmiAvailable": false,
                    "authModes": [
                        "otp"
                    ],
                    "displayName": "HDFC Bank Credit Card",
                    "priority": null,
                    "paymentOfferDetails": null,
                    "savedCardEmisubventionDetail": null,
                    "prepaidCard": false,
                    "isHybridDisabled": false,
                    "channelCode": "VISA",
                    "channelName": "Visa Inc.",
                    "isEmiHybridDisabled": false
                }, ],
                "userProfileSarvatra": null,
                "activeSubscriptions": null,
                "upiProfile": {
                    "respDetails": {
                        "profileDetail": {
                            "vpaDetails": [{
                                "name": "7777777777@paytm",
                                "defaultCreditAccRefId": "96XXX38",
                                "defaultDebitAccRefId": "96XXX38",
                                "primary": true
                            }],
                            "bankAccounts": [{
                                "bank": "Paytm Payments Bank",
                                "ifsc": "PYTM0123456",
                                "accRefId": "96XXX38",
                                "maskedAccountNumber": "XXXXXXXX7777",
                                "accountType": "SAVINGS",
                                "credsAllowed": [{
                                        "CredsAllowedDLength": "4",
                                        "CredsAllowedDType": "Numeric",
                                        "CredsAllowedSubType": "MPIN",
                                        "CredsAllowedType": "PIN",
                                        "dLength": "4"
                                    },
                                    {
                                        "CredsAllowedDLength": "6",
                                        "CredsAllowedDType": "Numeric",
                                        "CredsAllowedSubType": "SMS",
                                        "CredsAllowedType": "OTP",
                                        "dLength": "6"
                                    }
                                ],
                                "name": "Test Merchant",
                                "mpinSet": "Y",
                                "txnAllowed": "ALL",
                                "branchAddress": "All Branches",
                                "pgBankCode": "PAYTM",
                                "bankMetaData": {
                                    "perTxnLimit": "200000",
                                    "bankHealth": {
                                        "category": "GREEN",
                                        "displayMsg": ""
                                    }
                                }
                            }],
                            "profileStatus": "ACTIVE",
                            "upiLinkedMobileNumber": "917777777777",
                            "deviceBinded": false
                        },
                        "metaDetails": {
                            "npciHealthCategory": "GREEN",
                            "npciHealthMsg": ""
                        }
                    },
                    "upiOnboarding": false
                }
            },
            "addMoneyPayOption": {
                "savedMandateBanks": null,
                "paymentModes": [{
                        "displayName": "Net Banking",
                        "payChannelOptions": [{
                            "iconUrl": "AIRP.png",
                            "isHybridDisabled": false,
                            "channelCode": "AIRP",
                            "channelName": "AIRTEL PAYMENTS BANK"
                        }],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "onboarding": false,
                        "paymentMode": "NET_BANKING",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "Credit Card",
                        "payChannelOptions": [
    
                        ],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "prepaidCardSupported": false,
                        "onboarding": false,
                        "paymentMode": "CREDIT_CARD",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "Debit Card",
                        "payChannelOptions": [
    
                        ],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "prepaidCardSupported": false,
                        "onboarding": false,
                        "paymentMode": "DEBIT_CARD",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "BHIM UPI",
                        "payChannelOptions": [{
                                "iconUrl": "UPI.png",
                                "isHybridDisabled": false,
                                "channelCode": "UPI",
                                "channelName": "Unified Payment Interace"
                            },
                            {
                                "iconUrl": "UPIPUSH.png",
                                "isHybridDisabled": false,
                                "channelCode": "UPIPUSH",
                                "channelName": "Unified Payment Interface - PUSH"
                            },
                            {
                                "iconUrl": "UPIPUSHEXPRESS.png",
                                "isHybridDisabled": false,
                                "channelCode": "UPIPUSHEXPRESS",
                                "channelName": "Unified Payment Interface - PUSH Express"
                            }
                        ],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "onboarding": false,
                        "paymentMode": "UPI",
                        "isHybridDisabled": false
                    },
                    {
                        "displayName": "Paytm Payments Bank",
                        "payChannelOptions": [{
                            "iconUrl": "PPBL.png",
                            "balanceInfo": null,
                            "isHybridDisabled": false
                        }],
                        "feeAmount": null,
                        "taxAmount": null,
                        "totalTransactionAmount": null,
                        "priority": null,
                        "onboarding": false,
                        "paymentMode": "PPBL",
                        "isHybridDisabled": false
                    }
                ],
                "savedInstruments": [{
                    "iconUrl": "https://staticgw2.paytm.in/33.1.1/",
                    "oneClickSupported": false,
                    "cardDetails": {
                        "cardId": "201707291077050XXXXXX47678ef1041b96e6bcac3489",
                        "cardType": "CREDIT_CARD",
                        "expiryDate": "012022",
                        "firstSixDigit": "411111",
                        "lastFourDigit": "1111",
                        "status": "1",
                        "cvvLength": "3",
                        "cvvRequired": true,
                        "indian": true
                    },
                    "issuingBank": "HDFC",
                    "isEmiAvailable": false,
                    "authModes": [
                        "otp"
                    ],
                    "displayName": "HDFC Bank Credit Card",
                    "priority": null,
                    "paymentOfferDetails": null,
                    "savedCardEmisubventionDetail": null,
                    "prepaidCard": false,
                    "isHybridDisabled": false,
                    "channelCode": "VISA",
                    "channelName": "Visa Inc.",
                    "isEmiHybridDisabled": false
                }],
                "userProfileSarvatra": null,
                "activeSubscriptions": null,
                "upiProfile": {
                    "respDetails": {
                        "profileDetail": {
                            "vpaDetails": [{
                                "name": "7777777777@paytm",
                                "defaultCreditAccRefId": "9XXXX38",
                                "defaultDebitAccRefId": "96XXXX8",
                                "primary": true
                            }],
                            "bankAccounts": [{
                                "bank": "Paytm Payments Bank",
                                "ifsc": "PYTM0123456",
                                "accRefId": "96XXXX8",
                                "maskedAccountNumber": "XXXXXXXX7777",
                                "accountType": "SAVINGS",
                                "credsAllowed": [{
                                        "CredsAllowedDLength": "4",
                                        "CredsAllowedDType": "Numeric",
                                        "CredsAllowedSubType": "MPIN",
                                        "CredsAllowedType": "PIN",
                                        "dLength": "4"
                                    },
                                    {
                                        "CredsAllowedDLength": "6",
                                        "CredsAllowedDType": "Numeric",
                                        "CredsAllowedSubType": "SMS",
                                        "CredsAllowedType": "OTP",
                                        "dLength": "6"
                                    }
                                ],
                                "name": "Test Merchant",
                                "mpinSet": "Y",
                                "txnAllowed": "ALL",
                                "branchAddress": "All Branches",
                                "pgBankCode": "PAYTM",
                                "bankMetaData": {
                                    "perTxnLimit": "200000",
                                    "bankHealth": {
                                        "category": "GREEN",
                                        "displayMsg": ""
                                    }
                                }
                            }],
                            "profileStatus": "ACTIVE",
                            "upiLinkedMobileNumber": "917777777777",
                            "deviceBinded": false
                        },
                        "metaDetails": {
                            "npciHealthCategory": "GREEN",
                            "npciHealthMsg": ""
                        }
                    },
                    "upiOnboarding": false
                }
            },
            "merchantLimitInfo": {
                "merchantRemainingLimits": [{
                        "limitType": "DAILY",
                        "amount": "20000.00"
                    },
                    {
                        "limitType": "WEEKLY",
                        "amount": "50000.00"
                    },
                    {
                        "limitType": "MONTHLY",
                        "amount": "49729.00"
                    }
                ],
                "excludedPaymodes": [
                    "UPI",
                    "NET_BANKING",
                    "GIFT_VOUCHER"
                ],
                "message": "limit is breached for this pay-mode"
            }
        }
    }    
  return (
    <CreateModal
        title="Start Payment"
        description=""
        selectorPrimaryFocus=""
        primaryButtonText={paymentOptions.body.paymentFlow === "ADDANDPAY" ? "Add and Pay" : "Pay"}
        secondaryButtonText="Cancel"
    open={openPayment} onRequestClose={() => actions.setOpenPayment(false)} disableSubmit={textInput.length === 0 ? true : false}>
        <TextInput id="1" key="form-field-1" labelText="Text input label" placeholder="Placeholder" onChange={e => {
        setTextInput(e.target.value);
        setInvalid(false);
      }} onBlur={() => {
        textInput.length === 0 && setInvalid(true);
      }} invalid={invalid} invalidText="This is a required field" />
        <TextInput id="2" key="form-field-2" labelText="Text input label (optional)" placeholder="Placeholder" />
        <TextInput id="3" key="form-field-3" labelText="Text input label (optional)" placeholder="Placeholder" />
        <UnorderedList>
            {paymentOptions.body.addMoneyPayOption.paymentModes.map((mode, index) => (
                <ListItem key={index}>
                <h3>{mode.displayName}</h3>
                </ListItem>
            ))}
        </UnorderedList>
      </CreateModal>
  );
}

export default StartPaymentModal;