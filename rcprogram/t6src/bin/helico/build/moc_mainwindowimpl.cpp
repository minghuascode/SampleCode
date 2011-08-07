/****************************************************************************
** Meta object code from reading C++ file 'mainwindowimpl.h'
**
** Created: Tue May 25 13:03:42 2010
**      by: The Qt Meta Object Compiler version 62 (Qt 4.6.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "../src/mainwindowimpl.h"
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'mainwindowimpl.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 62
#error "This file was generated using the moc from 4.6.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
static const uint qt_meta_data_MYTreadReadUart[] = {

 // content:
       4,       // revision
       0,       // classname
       0,    0, // classinfo
       1,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       1,       // signalCount

 // signals: signature, parameters, type, tag, flags
      17,   16,   16,   16, 0x05,

       0        // eod
};

static const char qt_meta_stringdata_MYTreadReadUart[] = {
    "MYTreadReadUart\0\0SignalsDrawChannel()\0"
};

const QMetaObject MYTreadReadUart::staticMetaObject = {
    { &QThread::staticMetaObject, qt_meta_stringdata_MYTreadReadUart,
      qt_meta_data_MYTreadReadUart, 0 }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &MYTreadReadUart::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *MYTreadReadUart::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *MYTreadReadUart::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_MYTreadReadUart))
        return static_cast<void*>(const_cast< MYTreadReadUart*>(this));
    return QThread::qt_metacast(_clname);
}

int MYTreadReadUart::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QThread::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        switch (_id) {
        case 0: SignalsDrawChannel(); break;
        default: ;
        }
        _id -= 1;
    }
    return _id;
}

// SIGNAL 0
void MYTreadReadUart::SignalsDrawChannel()
{
    QMetaObject::activate(this, &staticMetaObject, 0, 0);
}
static const uint qt_meta_data_MainWindowImpl[] = {

 // content:
       4,       // revision
       0,       // classname
       0,    0, // classinfo
      29,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: signature, parameters, type, tag, flags
      20,   16,   15,   15, 0x08,
      49,   16,   15,   15, 0x08,
      79,   16,   15,   15, 0x08,
     106,   16,   15,   15, 0x08,
     133,   16,   15,   15, 0x08,
     156,   16,   15,   15, 0x08,
     184,   16,   15,   15, 0x08,
     204,   16,   15,   15, 0x08,
     233,   16,   15,   15, 0x08,
     262,   16,   15,   15, 0x08,
     284,   16,   15,   15, 0x08,
     306,   16,   15,   15, 0x08,
     320,   16,   15,   15, 0x08,
     334,   16,   15,   15, 0x08,
     357,   16,   15,   15, 0x08,
     376,   16,   15,   15, 0x08,
     400,   16,   15,   15, 0x08,
     420,   16,   15,   15, 0x08,
     444,   16,   15,   15, 0x08,
     464,   15,   15,   15, 0x08,
     478,   15,   15,   15, 0x08,
     492,   15,   15,   15, 0x08,
     508,   15,   15,   15, 0x08,
     528,   15,   15,   15, 0x08,
     541,   15,   15,   15, 0x08,
     554,   15,   15,   15, 0x08,
     573,  568,   15,   15, 0x08,
     596,   15,   15,   15, 0x08,
     617,  611,   15,   15, 0x08,

       0        // eod
};

static const char qt_meta_stringdata_MainWindowImpl[] = {
    "MainWindowImpl\0\0val\0FinDeCourseValueChanged(int)\0"
    "GrapheMoteurValueChanged(int)\0"
    "GraphePasValueChanged(int)\0"
    "InverseurStateChanged(int)\0"
    "TrimeValueChanged(int)\0"
    "DebatementValueChanged(int)\0"
    "DRValueChanged(int)\0TypeCurrentIndexChanged(int)\0"
    "ModeCurrentIndexChanged(int)\0"
    "FoncInterupteurA(int)\0FoncInterupteurB(int)\0"
    "FoncPotA(int)\0FoncPotB(int)\0"
    "FoncTimeEnvoyer(QTime)\0FoncMixSource(int)\0"
    "FoncMixDestination(int)\0FoncMixPositif(int)\0"
    "FoncMixInterupteur(int)\0FoncMixNegatif(int)\0"
    "FoncEnvoyer()\0FoncCharger()\0FoncEnregistr()\0"
    "FoncEnregistrSous()\0FoncImport()\0"
    "FoncExport()\0DrawChannel()\0text\0"
    "FoncNewCBPort(QString)\0FoncA_propos()\0"
    "state\0StateChangedInverseur3(int)\0"
};

const QMetaObject MainWindowImpl::staticMetaObject = {
    { &QMainWindow::staticMetaObject, qt_meta_stringdata_MainWindowImpl,
      qt_meta_data_MainWindowImpl, 0 }
};

#ifdef Q_NO_DATA_RELOCATION
const QMetaObject &MainWindowImpl::getStaticMetaObject() { return staticMetaObject; }
#endif //Q_NO_DATA_RELOCATION

const QMetaObject *MainWindowImpl::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->metaObject : &staticMetaObject;
}

void *MainWindowImpl::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_MainWindowImpl))
        return static_cast<void*>(const_cast< MainWindowImpl*>(this));
    if (!strcmp(_clname, "Ui::MainWindow"))
        return static_cast< Ui::MainWindow*>(const_cast< MainWindowImpl*>(this));
    return QMainWindow::qt_metacast(_clname);
}

int MainWindowImpl::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QMainWindow::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        switch (_id) {
        case 0: FinDeCourseValueChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 1: GrapheMoteurValueChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 2: GraphePasValueChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 3: InverseurStateChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 4: TrimeValueChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 5: DebatementValueChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 6: DRValueChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 7: TypeCurrentIndexChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 8: ModeCurrentIndexChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 9: FoncInterupteurA((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 10: FoncInterupteurB((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 11: FoncPotA((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 12: FoncPotB((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 13: FoncTimeEnvoyer((*reinterpret_cast< const QTime(*)>(_a[1]))); break;
        case 14: FoncMixSource((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 15: FoncMixDestination((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 16: FoncMixPositif((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 17: FoncMixInterupteur((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 18: FoncMixNegatif((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 19: FoncEnvoyer(); break;
        case 20: FoncCharger(); break;
        case 21: FoncEnregistr(); break;
        case 22: FoncEnregistrSous(); break;
        case 23: FoncImport(); break;
        case 24: FoncExport(); break;
        case 25: DrawChannel(); break;
        case 26: FoncNewCBPort((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 27: FoncA_propos(); break;
        case 28: StateChangedInverseur3((*reinterpret_cast< int(*)>(_a[1]))); break;
        default: ;
        }
        _id -= 29;
    }
    return _id;
}
QT_END_MOC_NAMESPACE
