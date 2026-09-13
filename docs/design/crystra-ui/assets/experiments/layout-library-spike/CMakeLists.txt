cmake_minimum_required(VERSION 3.10)
project(crystra_layout_spike CXX)
set(CMAKE_CXX_STANDARD 11)
set(ADAPTAGRAMS_ROOT "/tmp/crystra-adaptagrams-spike/cola" CACHE PATH "Pinned upstream checkout")
file(GLOB COLA_SOURCES "${ADAPTAGRAMS_ROOT}/libcola/*.cpp" "${ADAPTAGRAMS_ROOT}/libvpsc/*.cpp")
add_executable(cola-spike native.cpp ${COLA_SOURCES})
target_include_directories(cola-spike PRIVATE "${ADAPTAGRAMS_ROOT}")

file(MAKE_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/libcola")
file(WRITE "${CMAKE_CURRENT_BINARY_DIR}/libcola/config.h" "/* Spike build: cairo output disabled. */\n")
target_include_directories(cola-spike PRIVATE "${CMAKE_CURRENT_BINARY_DIR}")
file(GLOB HOLA_SOURCES "${ADAPTAGRAMS_ROOT}/libdialect/*.cpp" "${ADAPTAGRAMS_ROOT}/libavoid/*.cpp")
add_executable(hola-spike hola.cpp ${COLA_SOURCES} ${HOLA_SOURCES})
target_include_directories(hola-spike PRIVATE "${ADAPTAGRAMS_ROOT}" "${CMAKE_CURRENT_BINARY_DIR}")
# Upstream TGLF parsing performs reads/state changes inside COLA_ASSERT.
# Keep assertions enabled for this spike; do not patch upstream algorithms.
target_compile_options(hola-spike PRIVATE -UNDEBUG)
