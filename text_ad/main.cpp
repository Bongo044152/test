// module
#include "background_set.h"
#include "role.h"

#include <iostream>
#include <cmath>
#include <vector>
#include <unordered_map>

using namespace std;

void show_status(vector<Monster> monster_list, Player player) {
    printf("Current status :\n");
    cout << endl;
    printf("【 Player 】\n");
    printf("name : %s\nhp: %d\natk : %d\n", player.name.c_str(), player.hp, player.atk);
    cout << endl;
    printf("【 Monster 】\n");
    for(Monster mon : monster_list) {
        printf("name : %s\nhp: %d\natk : %d\n", mon.name.c_str(), mon.hp, mon.atk);
        printf("-------------------------------------------------\n");
    }
    cout << endl << endl;
}

int main() {
    
    // set the background
    Background_set background;
    string username = background.ask_username();

    Player player(50, 5, username);
    
    int levels[3] = {2,3,5}, game_routd = 0;

    vector<Monster> monster_list;

    while (true) {

        if(player.hp <= 0) {
            cout << "You Loss..." << endl;
            break;
        }

        if(monster_list.size() == 0) {
            if(game_routd >= 3 && player.hp > 0) {
                cout << "You Win!" << endl;
                break;
            }
            for(int i=0; i<levels[game_routd]; i++) {
                Monster slime(10,2,"slime");
                monster_list.push_back(slime);
            }
            game_routd++;
            show_status(monster_list, player);
        }

        player.go_atk(monster_list);

        // check if die
        for (auto it = monster_list.begin(); it != monster_list.end(); ) {
            if (it->hp <= 0) {
                it = monster_list.erase(it);
            } else {
                ++it;  // 只有當沒有刪除元素時才移動迭代器
            }
        }

        for(Monster &mon : monster_list) {
            mon.go_atk(player);
        }

        show_status(monster_list, player);
    }
    
    return 0;
}
