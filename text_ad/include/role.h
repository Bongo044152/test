#ifndef ROLE
#define ROLE

#include <iostream>
#include <cmath>
#include <vector>
#include <unordered_map>

using namespace std;

class Role {
public:
    int hp, atk;
    string name;

    Role(int hp, int atk, string name);
    virtual void hp_loss(int loss_hp) = 0;
};

class Monster;  // declare

class Player : public Role {
private: // prams
    bool rage;
    int skill_atk;

public:
    Player(int hp, int atk, string player_name);
    void go_atk(vector<Monster> &monster_list); // handel common atk behavior
    void hp_loss(int loss_hp) override; // handel hp loss

private:
    /**** ATK Part****/
    void common_atk(vector<Monster> &monster_list);
    void use_skill(vector<Monster> &monster_list);
};

class Monster : public Role {

public:
    Monster(int hp, int atk, string name);
    void go_atk(Player &target); // handel common atk behavior
    void hp_loss(int loss_hp) override; // handel monster hp loss
};

#endif