#include <iostream>
#include <vector>
#include <libcola/cola.h>
#include <libcola/compound_constraints.h>
int main(){int n,m,k;std::cin>>n>>m>>k;vpsc::Rectangles rs;std::vector<cola::Edge> es;cola::CompoundConstraints cs;for(int i=0;i<n;i++){double x,y,w,h;std::cin>>x>>y>>w>>h;rs.push_back(new vpsc::Rectangle(x-w/2,x+w/2,y-h/2,y+h/2));}for(int i=0;i<m;i++){int a,b;std::cin>>a>>b;es.push_back(cola::Edge(a,b));}for(int i=0;i<k;i++){int d,a,b,eq;double gap;std::cin>>d>>a>>b>>gap>>eq;cs.push_back(new cola::SeparationConstraint(d==0?vpsc::XDIM:vpsc::YDIM,a,b,gap,eq));}{cola::ConstrainedFDLayout alg(rs,es,250);alg.setAvoidNodeOverlaps(true);alg.setConstraints(cs);alg.run();}for(auto r:rs)std::cout<<r->getCentreX()<<" "<<r->getCentreY()<<"\n";for(auto c:cs)delete c;for(auto r:rs)delete r;}
