// module
#include "background_set.h"
#include "tool.h"

#include <iostream>
#include <cstdio>

using namespace std;

Background_set::Background_set() {
    Tool::clear_screen();
    // init private
    story = "In a distant kingdom, you are a young adventurer. One day, you receive a mysterious letter, written in a low, cryptic language, telling you that the fate of the kingdom will depend on your choices. Are you ready? An unprecedented adventure is about to begin. 【Press Enter to continue ... 】";
    cout << story;
    Tool::wait_unitl_enter();
    Tool::clear_screen();
}

string Background_set::ask_username() {
    string username;
    cout << "Please enter your name: ";
    getline(cin, username);  // Read the whole line as the username
    printf("Welcome, %s ! Your adventure begins now", username.c_str());
    fflush(stdout); // 強制刷新輸出流
    Tool::sleep(1);
    printf(".");
    fflush(stdout); // 強制刷新輸出流
    Tool::sleep(1);
    printf(".");
    fflush(stdout); // 強制刷新輸出流
    Tool::sleep(1);
    printf(".");
    fflush(stdout); // 強制刷新輸出流
    Tool::sleep(2);
    Tool::clear_screen();
    return username;
}
