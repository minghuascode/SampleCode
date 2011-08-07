#ifndef MAINWINDOWIMPL_H
#define MAINWINDOWIMPL_H
//
#include <QMainWindow>
#include <QSlider>
#include <QLabel>
#include <QCheckBox>
#include <QPainter>
#include <QSpinBox>
#include <QTimer>
#include <QMessageBox>
#include <QFileDialog>
#include <QFile>
#include <QThread>
#include <QGraphicsLineItem>
#include <QGraphicsScene>
#include <QGraphicsView>
#include <QProgressBar>
#ifdef Q_OS_LINUX
    #define _TTY_POSIX_
#endif
#include "ui_mainwindow.h"
#include "qextserialport/qextserialport.h"
//

class MYTreadReadUart : public QThread
{
    Q_OBJECT
        public:
            MYTreadReadUart(QObject *parent);
            void run();
            int stop;


        signals:
            void SignalsDrawChannel();
};

class MainWindowImpl : public QMainWindow, public Ui::MainWindow
{
Q_OBJECT
public:
	MainWindowImpl( QWidget * parent = 0, Qt::WFlags f = 0 );
	~MainWindowImpl();
	QextSerialPort * port;
        unsigned int channel[6];

private:
        QSlider * SlidFinDeCourse[6][2];
        QLabel * LabValFinDeCourse[6][2];
        QLabel * LabFinDeCourse[6];
	QLabel * LabTrime[6];
        QCheckBox * CheckInverseur[6];
        QLabel * LabCheckInverseur[6];
	QSpinBox * SpinGrapheMoteur[2][5];
	QSpinBox * SpinGraphePas[2][5];
	QSlider * SlidTrime[6];
	QSlider * SlidDR[2][3];
	QLabel * LabDR[3];
	QLabel * LabValDR[2][3];
	QSlider * SlidDebatement[3];
	QLabel * LabDebatement[3];
	QLabel * LabValDebatement[3];
	QLabel * LabValTrime[6];
	QComboBox * MixSource[3];
        QLabel * LabMixSource[3];
	QComboBox * MixDestination[3];
        QLabel * LabMixDestination[3];
	QComboBox * MixInterupteur[3];
        QLabel * LabMixInterupteur[3];
	QSpinBox * MixPositif[3];
        QLabel * LabMixPositif[3];
        QSpinBox * MixNegatif[3];
        QLabel * LabMixNegatif[3];
	QTimer * timer;
	QString fichier_courant;
	bool load(QString chem,bool import);
	void save(QString chem,bool export_);
	QString temp;
	MYTreadReadUart* TreadRead;
        QGraphicsLineItem LineGrilleMoteur[2][5];
        QGraphicsLineItem LineGrapheMoteur[2][4];
        QGraphicsLineItem LineGrillePas[2][5];
        QGraphicsLineItem LineGraphePas[2][4];
        QGraphicsScene * SceneMoteur;
        QGraphicsView * ViewMoteur;
        QGraphicsScene * ScenePas;
        QGraphicsView * ViewPas;
        QLabel * LabCannal[6];
        QProgressBar * QbCannal[6];
        QSpacerItem  * QsCannal[6];
        QFrame * Line[2];

        void DrawGraphe(QPointF points[2][5], QGraphicsLineItem LineGrille[2][5],QGraphicsLineItem LineGraphe[2][4]);

private slots:
        void FinDeCourseValueChanged(int val);
	void GrapheMoteurValueChanged(int val);
	void GraphePasValueChanged(int val);
        void InverseurStateChanged(int val);
	void TrimeValueChanged(int val);
	void DebatementValueChanged(int val);
	void DRValueChanged(int val);
	void TypeCurrentIndexChanged(int val);
	void ModeCurrentIndexChanged(int val);
	void FoncInterupteurA(int val);
	void FoncInterupteurB(int val);
	void FoncPotA(int val);
	void FoncPotB(int val);
        void FoncTimeEnvoyer(const QTime & val);
	void FoncMixSource(int val);
	void FoncMixDestination(int val);
	void FoncMixPositif(int val);
	void FoncMixInterupteur(int val);
        void FoncMixNegatif(int val);
	void FoncEnvoyer();
	void FoncCharger();
	void FoncEnregistr();
	void FoncEnregistrSous();
	void FoncImport();
	void FoncExport();
        void DrawChannel();
        void FoncNewCBPort(const QString & text);
        void FoncA_propos();
        void StateChangedInverseur3( int state);
};
#endif




