
/*                                                                                                 
 * compile with g++ 4.6.3: g++ -I ./boost_1_47_0/ test2.cpp
 */

#include <typeinfo>
#include <string>
#include <iostream>

#include <boost/fusion/include/sequence.hpp>
#include <boost/fusion/include/algorithm.hpp>
#include <boost/fusion/include/vector.hpp>

#include <boost/fusion/include/adapt_struct.hpp>
#include <boost/lexical_cast.hpp>

#include <stdio.h>

using namespace boost::fusion;

struct print_vars {
    template <typename T>
    void operator()(T const & x) const {
        std::cout << '<' << typeid(x).name() <<  ' ' << x << '>';
    };
};

// Your existing struct
struct Foo
{
    int i;
    bool j;
    char k[100];
};

// Generate an adapter allowing to view "Foo" as a Boost.Fusion sequence
BOOST_FUSION_ADAPT_STRUCT(
    Foo,
    (int, i)
    (bool, j)
    (char, k[100])
)

// The action we will call on each member of Foo
struct AppendToTextBox
{
    //AppendToTextBox(RichEditControl& Ctrl) : m_Ctrl(Ctrl){}
    template<typename T>
    void operator()(T& t) const {
        printf("  --%s--%s--  \n", 
	       typeid(t).name(), 
	       boost::lexical_cast<std::string>(t).c_str());
	if (typeid(t).name()[0] == 'c')
            printf("  --%s--%s--  \n", 
	           typeid(t).name(), t);
    }
    //RichEditControl& m_Ctrl;
};

// Usage:
//void FillTextBox(Foo& F, RichEditControl& Ctrl)
//{
//    boost::fusion::for_each(F, AppendToTextBox(Ctrl));
//}

int main(int argc, char *argv[]) 
{
  vector<int,char,std::string> stuff(1,'x',"howdy");
  int i = at_c<0>(stuff);
  char ch = at_c<1>(stuff);
  std::string s = at_c<2>(stuff);

  for_each(stuff, print_vars());

  struct Foo f = { 33, false, "abcd" };
  for_each(f, AppendToTextBox());
  
  return 0;
}

