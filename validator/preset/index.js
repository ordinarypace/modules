const ValidatePreset = {
    name: {
        rule: /[a-zA-Z가-힇]/,
        required: '사용자 이름을 입력해 주세요.',
        invalid: '한글, 영문으로만 입력해 주세요.'
    },

    email: {
        rule: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        required: '이메일을 입력해 주세요.',
        invalid: '이메일을 양식에 맞게 다시 입력해 주세요.'
    },

    year: {
        rule: /^(19|20)\d{2}$/,
        required: '연도를 입력해 주세요.',
        invalid: '해당 연도를 정확히 입력해 주세요.'
    },

    month: {
        rule: /^(1[0-2]|[1-9])$/,
        required: '해당 월을 입력해 주세요.',
        invalid: '해당 월을 정확히 입력해 주세요.'
    },

    day: {
        rule: /^[1-9]|[12]\d|3[01]$/,
        required: '해당 일을 입력해 주세요.',
        invalid: '해당 일을 정확히 입력해 주세요.'
    },

    password: {
        rule: /((?=.*\d)(?=.*[a-zA-Z])(?=.*$).{6,15})/,
        required: '비밀번호를 입력해 주세요.',
        invalid: '비밀번호를 정확히 입력해 주세요.'
    }
};

export default ValidatePreset;