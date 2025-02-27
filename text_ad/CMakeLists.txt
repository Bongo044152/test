cmake_minimum_required(VERSION 3.15)

project(
    Adventure
    VERSION 0.0.1
    DESCRIPTION "hello"
    LANGUAGES CXX
)

file(GLOB_RECURSE SOURCE_FILES include/*.cpp)

add_executable(
    Adventure
    main.cpp
    ${SOURCE_FILES}
)

target_compile_features(Adventure PRIVATE cxx_std_20)
target_include_directories(Adventure PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)