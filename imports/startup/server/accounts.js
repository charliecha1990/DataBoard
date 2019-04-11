import { Accounts } from 'meteor/accounts-base'
import User from '/imports/api/users/User';

/* https://docs.meteor.com/api/accounts-multi.html#AccountsServer-validateLoginAttempt */
Accounts.validateLoginAttempt(({ user, allowed }) => {
  if (!allowed) {
    return false;
  }

  // only allow users who are findable through our model (for soft remove)
  if (!User.findOne(user._id)) {
    return false;
  }

  return true;
});

Accounts.emailTemplates = {
  from: process.env.MAIL_FROM,
  siteName: process.env.URL_HOST,
  enrollAccount: {
    // from: A Function used to override the from address defined by the emailTemplates.from field.
    subject: () => "You've received a Sibyl account!",
    html: (user, url) => `
<p>Welcome!</p>

<p>To start using Sibyl, <a href="${url.replace( '#/', '' )}">click here</a> or the link below:</p>

<p>${url.replace( '#/', '' )}</p>

<p>Thanks!</p>
`,
    text: (user, url) => `
Welcome!

To start using Sibyl, simply click the link below:

${url.replace( '#/', '' )}

Thanks!
`
  }
}
