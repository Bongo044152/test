// module
#include "role.h"
#include "tool.h"

#include <iostream>
#include <cmath>

using namespace std;

Role::Role(int hp, int atk, string name) : hp(hp), atk(atk), name(name) {}

Player::Player(int hp, int atk, string player_name) : Role(hp, atk, player_name) {
    this->rage = false;
    this->skill_atk = 8;
}

void Player::go_atk(vector<Monster> &monster_list) {
    // get mod
    char mod;
    while (true) {
        cout << "A: Common Attack, B: Use Skill -> (A)";
        string buffer;
        getline(cin, buffer);
        mod = buffer[0];
        if (mod == 'A' || mod == '\0') {
            Tool::clear_screen();
            this->common_atk(monster_list);
        }
        else if (mod == 'B') {
            Tool::clear_screen();
            this->use_skill(monster_list);
        }
        else {
            cout << "Please press enter again..." << endl;
            continue;
        }
        break;
    }
}

void Player::hp_loss(int loss_hp) {
    if (!this->rage && this->hp < 10) {
        this->atk += 7;
        this->skill_atk += 7;
        cout << "Rage triggered! Your attack power has increased (+7), current attack: "
        << this->atk << " (+7)" << endl;
        this->rage = true;
    }
    else if (this->rage && this->hp > 10) {
        this->atk -= 7;
        this->skill_atk -= 7;
        cout << "Your HP is now greater than 10, rage has been canceled, current attack: "
        << this->atk << endl;
        this->rage = false;
    }
    this->hp -= loss_hp;
}

void Player::common_atk(vector<Monster> &monster_list) {
    Monster &target = monster_list[0];
    printf("%s shouts loudly and causes %d damage to %s\n", this->name.c_str(), this->atk, target.name.c_str());
    target.hp_loss(this->atk);
}

void Player::use_skill(vector<Monster> &monster_list) {
    int length = min(3, (int)monster_list.size());
    printf("Using skill......\n");
    for (int i = 0; i < length; i++) {
        Monster &target = monster_list[i];
        target.hp_loss(this->skill_atk);
    }
}

Monster::Monster(int hp, int atk, string monster_name) : Role(hp, atk, monster_name) {};

void Monster::go_atk(Player &target) {
    printf("%s hits %s and causes %d damage\n", this->name.c_str(), target.name.c_str(), this->atk);
    target.hp_loss(this->atk);
}

void Monster::hp_loss(int loss_hp) {
    printf("%s says 'Ohh!' and loses %d HP\n", this->name.c_str(), loss_hp);
    this->hp -= loss_hp;
    if (this->hp <= 0) {
        printf("%s dies...\n", this->name.c_str());
    }
}
