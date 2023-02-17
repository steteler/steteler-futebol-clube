const errorBlankFields = 'All fields must be filled';

const errorEmailPasswordInvalid = {
  status: 401,
  message: 'Incorrect email or password',
};

const errorSameTeam = {
  status: 422,
  message: 'It is not possible to create a match with two equal teams',
};

const errorTeamIdInvalid = {
  status: 404,
  message: 'There is no team with such id!',
};

export { errorBlankFields, errorEmailPasswordInvalid, errorSameTeam, errorTeamIdInvalid };
