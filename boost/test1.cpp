                                                                                                   
/*                                                                                                 
 * compile with g++ 4.6.3: g++ -I ./boost_1_47_0/ test1.cpp
 */

#include <typeinfo>
#include <string>
#include <iostream>

#include <boost/fusion/include/sequence.hpp>
#include <boost/fusion/include/algorithm.hpp>
#include <boost/fusion/include/vector.hpp>

using namespace boost::fusion;

struct print_vars {
    template <typename T>
    void operator()(T const & x) const {
        std::cout << '<' << typeid(x).name() <<  ' ' << x << '>';
    };
};


int main(int argc, char *argv[]) 
{
  vector<int,char,std::string> stuff(1,'x',"howdy");
  int i = at_c<0>(stuff);
  char ch = at_c<1>(stuff);
  std::string s = at_c<2>(stuff);

  for_each(stuff, print_vars());

  return 0;
}

