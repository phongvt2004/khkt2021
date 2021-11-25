



export const site_name = "Study Group"

// export const auth_service = "https://study-group-auth.herokuapp.com"
export const auth_service = "http://103.90.229.216:30001"
export const api_signin = `${auth_service}/login`
export const api_signup = `${auth_service}/register`

export const user_service = "http://103.90.229.216:30006"
export const api_user_info = `${user_service}/users/info`
export const api_user_status = `${user_service}/users/status`
export const api_user_add_gudsub = `${user_service}/add/good/subject`
export const api_user_add_badsub = `${user_service}/add/bad/subject`

export const mail_service = "http://103.90.229.216:30008"

export const group_service = "http://103.90.229.216:30002"
export const api_group_user = `${group_service}/group`
export const api_group_server = `${group_service}/group/server`
export const api_group_join = `${group_service}/group/join`
export const api_group_deny = `${group_service}/group/deny`

export const member_service = "http://103.90.229.216:30005"
export const api_member = `${member_service}/member`


export const test_service = "http://103.90.229.216:30004"
export const api_group_test_all = `${test_service}/group/test/all`
export const api_group_test_id = `${test_service}/group/test/id`
export const api_group_test_result = `${test_service}/group/result`
export const api_group_test = `${test_service}/group/test`
export const api_group_do_test = `${test_service}/group/dotest`
export const api_system_test_get = `${test_service}/system/test`
export const api_system_test_result = `${test_service}/system/result`


export const question_service = "http://103.90.229.216:30003"
export const api_question_group_get = `${question_service}/group/question/test`
export const api_question_group = `${question_service}/group/question`
export const api_question_system_gettest = `${question_service}/system/question/test`
export const api_question_system = `${question_service}/system/question`


export const history_service = "http://103.90.229.216:30007"
export const api_history_oldtest = `${history_service}/test`
export const api_history_result = `${history_service}/result/history`

export const upload_service = "http://103.90.229.216:30010"
export const api_upload_chat = `${upload_service}/upload/messages`
export const api_upload_quest = `${upload_service}/upload/questions`

export const socket_cluster = "http://103.90.229.216:30012"
export const socket_chat = `${socket_cluster}/chat`
export const socket_chat_noti = `${socket_cluster}/notifyChat`
export const socket_noti = `${socket_cluster}/notify`


export const chat_service = "http://103.90.229.216:30009"
export const api_chat = `${chat_service}/chat`

export const notify_service = "http://103.90.229.216:30011"
export const api_notify = `${notify_service}/notify`
export const api_notify_read = `${notify_service}/notify/isRead`

export const search_service = "http://103.90.229.216:30013"
export const api_search_group = `${search_service}/search/group`
export const api_search_users = `${search_service}/search/users`

export const list_sub = [
    "Toán",
    "Ngữ văn",
    "Sinh học",
    "Vật lý",
    "Hóa học",
    "Lịch sử",
    "Địa lý",
    "Tiếng Anh",
    "Công nghệ",
    "GDCD",
    "Tin học"
]

export const classes = [
    10, 11, 12
]
