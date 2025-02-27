#ifndef TOOL_H  
#define TOOL_H

#include <string>  
#include <chrono>  
#include <thread>  

class Tool {
public:
    
    static void sleep(float time);
    static void clear_screen();
    static void wait_unitl_enter();
};

#endif  
