/*
 * compile with g++ 4.4.6: g++ -I boost_1_35_0 test4.cpp
 */
#include <typeinfo>
#include <string>

#include <boost/fusion/include/sequence.hpp>
#include <boost/fusion/include/algorithm.hpp>
#include <boost/fusion/include/adapt_struct.hpp>
#include <boost/lexical_cast.hpp>
#include <cxxabi.h>
#include <stdio.h>
using namespace boost::fusion;

struct Foo_s { int i; char k[100]; };
BOOST_FUSION_ADAPT_STRUCT( Foo_s,  (int, i)  (char, k[100]) )

struct Bar_s { int v; Foo_s w; };
BOOST_FUSION_ADAPT_STRUCT( Bar_s, (int, v)  (Foo_s, w) )

template <typename T2> struct Dec_s       {  static void decode(T2   & f); };
template <           > struct Dec_s<int > {  static void decode(int  & f); };
template <           > struct Dec_s<char> {  static void decode(char & f); };

struct AppendToTextBox {
    template <typename T>
    void operator()(T& t) const {
        int status = 0;
        const char *realname = abi::__cxa_demangle(typeid(t).name(), 0, 0, &status);
        printf("  typename: %s  value: %s  realname: %s\n", typeid(t).name(),
               boost::lexical_cast<std::string>(t).c_str(), realname);

        Dec_s<T>::decode(t);
    }
};

template <typename T2> void Dec_s<T2>::decode(T2 & f) {
    for_each(f, AppendToTextBox());
};
void Dec_s<int >::decode(int  & f) {};
void Dec_s<char>::decode(char & f) {};

int main(int argc, char *argv[]) {
  Bar_s f = { 2, { 3, "abcd" } };
  Dec_s<Bar_s>::decode(f);
  return 0;
}

