/*
 * compile with g++ 4.4.6: g++ -I boost_1_35_0 test3.cpp
 */
#include <typeinfo>
#include <string>

#include <boost/fusion/include/sequence.hpp>
#include <boost/fusion/include/algorithm.hpp>

#include <boost/fusion/include/adapt_struct.hpp>
#include <boost/fusion/include/size.hpp>
#include <boost/lexical_cast.hpp>
#include <cxxabi.h>

#include <stdio.h>
using namespace boost::fusion;

struct Foo_s { int i; bool j; char k[100]; };
BOOST_FUSION_ADAPT_STRUCT( Foo_s,  (int, i)  (bool, j)  (char, k[100]) )

struct Bar_s { int v; Foo_s w; int x; };
BOOST_FUSION_ADAPT_STRUCT( Bar_s, (int, v)  (Foo_s, w)  (int, x) )

struct AppendToTextBox {
    template <typename T>
    void operator()(T& t) const {
        int status = 0;
        const char *realname = abi::__cxa_demangle(typeid(t).name(), 0, 0, &status);
        printf("  --%s--%s--%s--  \n", typeid(t).name(),
               boost::lexical_cast<std::string>(t).c_str(), realname);

        std::string rn(realname);
        if ( rn.rfind("_s") == rn.size()-2 ) {
#if 0 /* this can not compile */
            for_each(t, AppendToTextBox());
#else
            decode(&t, rn);
#endif
        }
    }
};

void decode(void *f, std::string & intype ) {
    if ( intype.find("Foo_s") == 0 ) {
        printf("Foo_s decode\n");
        for_each( *(Foo_s *)f, AppendToTextBox());
    }
};

int main(int argc, char *argv[])
{
  Bar_s f = { 2, { 3, false, "abcd" }, 4 };
  printf("size of Bar_s: %d \n", result_of::size<Bar_s>::type::value);
  for_each(f, AppendToTextBox());
  return 0;
}

