import * as admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'gobelins-bombastic-manager',
    private_key_id: '6cc7f48ecdadd43c9ef1eaf090d2b0421981d0dd',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDQ5TbxJJgUegIk\n8Dt57gLEtQtalwvEYBkfvFxyhr9COxPulVsXI7QtuPPNR9PaLWfGm/zbpZEwsHAj\n4/zwxWQ54wEAWQth2IEEkXkWxNXhQvvx2D0/bzBzffgeioSDNNdmm2waIf9lCYHo\nxJgqYEntcp4+nNu0s8b9+sDtxLBUwjVAHJLqwUnv4Ez/lHkx0+FpIsZcUcxcbpbv\n6bDSXC4Ms4TnNvQ5vUM1tTmcfvkQAZZofVoo8QNBOF3tKCn8d+DckG7wLpjHcc5r\ndFWrwD9H/8Jf3sIhtHlrbdx9l6dQ/rlArEB1ZVEtYl2JfabB4/4ytoTRRHFH6v8J\nYWw7lrA7AgMBAAECggEAU4OgEI5Zwq34l333uUp/jtb2oBQNH0hwIvDyYNMgOcFW\nuaa6kSi0CyeLSQGzX+GRQKTyVXn+7uFLI/4tDLFN3Zq0tsfitg6RnhrutzygaXuX\nMFwMOIUicLnm7YbhbXc9uobelCANc/52EnIuh5qRU73kKBIcAEVzg+yxHx3ohSmZ\n3BPMXV5WwJbBTMf30QtR435CAMZ7KM5F6CqdRnBCyMY9nLHtmjcUNTYmen7rnT5O\nhWzIR5IT2aPTZ5jveCVwHMhnXMG5VGbRYKrGITvILNPLhoP8J7al+fg3k6b+OOKq\ncMwuszQNVplnzXvu4E3D0BFCDww3fFIi/pHQMKEQcQKBgQD932tm3PzipxdXuyLk\nITwPbZz9NLFrLv+tcUi9nC0m0i4S8nMUuiuqxihSZcdgnw+zafbDdNg0qiiyOk4D\nw1dv0GmleECo+1tNICvCiZMXutCJrQlXs2JjwaqONsbgERUUI3lWuUqd0Ocd9P06\nEnpM228XbrEJIY2pJOMpIo3tEwKBgQDSpVCBzJIc5rtbxAQbPp8AlxbG4z84oGjg\nbFfBB3wTwRJ9cm33g1pjJ1oPVdosMN6zEmzvFceybJTsBjY1Gl6mCojI7fUqhvWX\nCeqkWWkaX+/gBvQlxpcgeSH1S/+ILnakP+1mZPPqbo9BMX0g2mW3B3FNjKU5Jd63\nCPCDJk9dOQKBgQC7WGOevhfUfvAH6u59oVT8IazHYlpHOaCucrn2Ssk7K8Gac9af\nBh/xX1gkLj2qvNbOVLUoWhKvEp8Dn2kw97ePqSI9XPeCfDNNQB9q6TFmQpNf9hS9\n5oAGE8X0OtIaSiDfAqqpaAV7Xs0fW0p/z2D3VLuvdB0rGtq6ZqFIGtrXhwKBgQDR\nfEaMT34f7/b0VAQhdC180MV+FhGRpzWluxmqhl8G5kQVLe/e72q8oS4XgjHvMMrJ\nG9HqE6b98q5H7AWM2iS2zFMsQDpJiN5Ezz/jImg8KpzMFx5HUzCIwu7anDIMpOio\ngEsAQfWxdzJQi379ZTUyyNwNW4oVQ2wya1mFlFvpQQKBgQDd05QmEdaIeeu+3xLk\nMmdLgIirKNpY1O7nAvNQshL4zokDLbcV+CnOIvhi2ZFdib/5RDFICIBs8069x6su\n7bKM3RTeCMTbhDwHL+5qvFNr7wUqfISIDygi6Y+YpFLV/tcz0UzwkcJq6yNqb/yH\nwlngXIlrYEpL1KyvYi5cLBaqzQ==\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-5135t@gobelins-bombastic-manager.iam.gserviceaccount.com',
    client_id: '102970626016184642281',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5135t%40gobelins-bombastic-manager.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  }),
  databaseURL: 'https://gobelins-bombastic-manager.firebaseio.com',
})

export default class Firestore {
  // call on firestore
  db() {
    return admin.firestore()
  }
}
