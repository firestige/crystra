#include <iostream>
#include <fstream>
#include "libdialect/io.h"
#include "libdialect/graphs.h"
#include "libdialect/hola.h"
int main(int argc,char** argv){auto g=dialect::buildGraphFromTglf(std::cin);dialect::doHOLA(*g);std::cout<<g->writeTglf(true);if(argc>1){std::ofstream f(argv[1]);f<<g->writeSvg();}}
