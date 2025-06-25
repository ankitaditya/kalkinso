export const env = () => {
    const config = {
        "TWILIO_ACCOUNT_SID":"ACf697c7f327c2fb91172ba01715416f5e",
        "TWILIO_AUTH_TOKEN":"694df40ce84836fc273ca66bb1d31467",
        "TWILIO_SERVICE_SID":"VA104814eabf7d2e12d931592df69c814e",
        "REACT_APP_AWS_ACCESS_KEY_ID":"AKIA6GBMDGBCY6SO4V6B",
        "REACT_APP_AWS_SECRET_ACCESS_KEY":"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",
        "REACT_APP_OPENAI_API_KEY":"sk-svcacct-hq8GriMVkV3BsGUJq1M1rUWRDHqHWTKTIs59UHCQyLmDQM8rV-tK2UZVdEBWsHXNAKT3BlbkFJ0pWG-QNUp49Iy522_vuVAt8giY4iQdU8ivAAXTi3239HmsUp-vVPyJUO3YGbjPPbMA",
        "REACT_APP_PEXELS_API_KEY":"JHaLO1yToRG9Osg0FiKQKJWZE8yi0GSlh2foFPkqtfoOwqoAtbQc9ElY",
        "REACT_APP_JWT_SECRET":"jNp7gUMIDR1kcTgwqwoOLPvnb8kYJpIP"
    }
    Object.keys(config).forEach(key => {
        process.env[key] = config[key]
    })
}