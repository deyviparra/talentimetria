export const getEmailHTML = (title, subtitle) => `<html>
<head>
    <title>${title}</title>
</head>
<body>
    <h1>${title}</h1>
    <p>${subtitle}</p>
</body>
</html>`;

export const sendEmail = async (to, subject) => {
    const html = getEmailHTML(subject, "This is a test email");
    await sendEmailService(to, subject, html);
};