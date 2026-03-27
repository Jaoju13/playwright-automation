import { faker } from '@faker-js/faker';

export const loginData = {

      PATH: '/direct/login', 
      
      UserInvalid: { 
            phonemore : '09722019733',
            phoneless: '097220197',
            phoneInvalid: '0272201973',
            emailInvalid: 'bbubble1a@',
            pass : '12300584545454544',
      },

      UserNoData: { 
            phone: '0657841568',
            email: 'Testlogin@gmail.com',
            pass : '1234',
      },

      UserAlready: { 
            phone: '0972201973',
            email: 'fortestsys007@gmail.com',
            pass : 'Be220216',
      },
};