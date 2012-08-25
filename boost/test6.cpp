/* compile with g++ 4.4.6: g++ -I boost_1_35_0 test6.cpp */
#include <typeinfo>
#include <string>
#include <boost/fusion/include/sequence.hpp>
#include <boost/fusion/include/algorithm.hpp>
#include <boost/fusion/include/adapt_struct.hpp>
#include <boost/fusion/include/is_sequence.hpp>
#include <boost/mpl/eval_if.hpp>
#include <boost/type_traits.hpp> // is_array, is_class, remove_bounds
#include <boost/lexical_cast.hpp>
#include <cxxabi.h>
#include <stdio.h>
using namespace boost::fusion;

struct Foo_s { int i; typedef char k_t[10]; Foo_s::k_t k; };
BOOST_FUSION_ADAPT_STRUCT( Foo_s,  (int, i)  (Foo_s::k_t, k) )

struct Bar_s { int v; typedef Foo_s w_t[2]; Bar_s::w_t w; };
BOOST_FUSION_ADAPT_STRUCT( Bar_s, (int, v)  (Bar_s::w_t, w) )

template <typename T2> struct Dec_s;
struct AppendToTextBox {
  template <typename T> void operator()(T& t) const {
        Dec_s<T>::decode(t);
  }
};

template <typename T2> struct DecImplSeq_s {
  typedef DecImplSeq_s<T2> type;
  static void decode(T2   & f) { for_each(f, AppendToTextBox()); };
};

template <typename T2> struct DecImplArray_s {
  typedef DecImplArray_s<T2> type;
  typedef typename boost::remove_bounds<T2>::type slice_t;
  static const size_t size = sizeof(T2) / sizeof(slice_t);
  static inline void decode(T2 & t) {
    for(size_t idx=0; idx<size; idx++) { Dec_s<slice_t>::decode(t[idx]); }
  }
};

template <typename T2> struct DecImplVoid_s {
  typedef DecImplVoid_s<T2> type;
  static void decode(T2   & t) { 
    int status = 0;
    const char *realname = abi::__cxa_demangle(typeid(t).name(), 0, 0, &status);
    printf("  typename: %s  value: %s  realname: %s\n", typeid(t).name(),
           boost::lexical_cast<std::string>(t).c_str(), realname);
  };
};

template <typename T2> struct DecCalc_s {
  typedef 
    typename boost::mpl::eval_if< traits::is_sequence<T2>, DecImplSeq_s<T2>, 
    typename boost::mpl::eval_if< boost::is_array<T2>, 
                                 boost::mpl::identity< DecImplArray_s<T2> >,
    DecImplVoid_s<T2>   > >
  ::type type;
};

template <typename T2> struct Dec_s : public DecCalc_s<T2>::type { };

int main(int argc, char *argv[]) {
  Bar_s f = { 2, {{ 3, "abcd" },{ 4, "defg" }} };
  Dec_s<Bar_s>::decode(f);
  return 0;
}

