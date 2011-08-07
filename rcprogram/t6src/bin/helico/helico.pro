QT = gui core
CONFIG += warn_on \
 qt \
 DESTDIR \
  bin
 OBJECTS_DIR =  build
 MOC_DIR =  build
 UI_DIR =  build
 FORMS =  ui/mainwindow.ui
 HEADERS =  src/mainwindowimpl.h  src/tab.h
 SOURCES =  src/mainwindowimpl.cpp  src/main.cpp  src/qextserialport/qextserialbase.cpp  src/qextserialport/qextserialport.cpp
 TEMPLATE =  app
SOURCES += src/qextserialport/posix_qextserialport.cpp
