function getUserId() {
    if (typeof localStorage.userId === typeof undefined) return 2;
    else return localStorage.userId;
}
