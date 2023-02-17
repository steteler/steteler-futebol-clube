export const completeUser = {
  id: 2,
  username: 'User',
  role: 'user',
  email: 'user@user.com',
  password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
};

export const failedAuthLogin = {
  email: 'user@user.com',
  password: 'hbcdsjhabjsh',
};

export const missingInfoLogin = {
  email: 'user@user.com',
};

export const successAuthLogin = {
  email: 'user@user.com',
  password: 'secret_user',
};

export const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAdXNlci5jb20iLCJpYXQiOjE2NzQ1NjM2MzMsImV4cCI6MTY3NTE2ODQzM30.6EuUWStOforWnvG82oXqPM5PYR56xf-pjvDOHyL9Pwc';

export const invalidToken = '123';
