function getUserId() {
    if (typeof localStorage.userId == "undefined") return 2;
    else return localStorage.userId;
}
