/*
        Copyright 2008 Fourquier Simon

        This file is part of Confiture.

        Confiture is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        Confiture is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with Confiture.  If not, see <http://www.gnu.org/licenses/>

*/

#include "mainwindowimpl.h"
#include "tab.h"
//
MainWindowImpl::MainWindowImpl( QWidget * parent, Qt::WFlags f) 
        : QMainWindow(parent, f)
{	
    setupUi(this);

    port = new QextSerialPort();

    TreadRead=new MYTreadReadUart(this);
    connect( TreadRead, SIGNAL( SignalsDrawChannel() ),this, SLOT( DrawChannel() ) );

    for(int x=0;x<6;x++)
    {
        LabFinDeCourse[x] = new QLabel(FinDeCourse);
        ((QGridLayout*)(FinDeCourse->layout()))->addWidget(LabFinDeCourse[x],0,x);
        LabFinDeCourse[x]->setNum(x+1);
        LabFinDeCourse[x]->setAlignment(Qt::AlignHCenter);
        for(int y=0;y<2;y++)
        {
            SlidFinDeCourse[x][y] = new QSlider(FinDeCourse);
            ((QGridLayout*)(FinDeCourse->layout()))->addWidget(SlidFinDeCourse[x][y],2+y,x);
            SlidFinDeCourse[x][y]->setOrientation(Qt::Vertical);
            SlidFinDeCourse[x][y]->setMaximum(120);
            SlidFinDeCourse[x][y]->setProperty("num",x);
            SlidFinDeCourse[x][y]->setProperty("haut_bas",y);
            if(y==0)
            {
                SlidFinDeCourse[x][y]->setValue(120);
            }
            else
            {
                SlidFinDeCourse[x][y]->setValue(0);
            }

            LabValFinDeCourse[x][y] = new QLabel(FinDeCourse);
            LabValFinDeCourse[x][y]->setMinimumWidth(25);
            ((QGridLayout*)(FinDeCourse->layout()))->addWidget(LabValFinDeCourse[x][y],1+y*3,x);
            LabValFinDeCourse[x][y]->setText("120");
            LabValFinDeCourse[x][y]->setAlignment(Qt::AlignHCenter);
            connect( SlidFinDeCourse[x][y], SIGNAL( valueChanged(int) ), this, SLOT( FinDeCourseValueChanged(int) ) );
        }
    }

    for(int y=0;y<3;y++)
    {
        LabDR[y] = new QLabel(DR);
        ((QGridLayout*)(DR->layout()))->addWidget(LabDR[y],0,y);
        LabDR[y]->setMinimumWidth(25);
        if(y<2)
        {
            LabDR[y]->setNum(y+1);
        }
        else
        {
            LabDR[y]->setNum(4);
        }
        LabDR[y]->setAlignment(Qt::AlignHCenter);

        for(int x=0;x<2;x++)
        {

            LabValDR[x][y] = new QLabel(DR);
            ((QGridLayout*)(DR->layout()))->addWidget(LabValDR[x][y],1+x*3,y);
            LabValDR[x][y]->setText("60");
            LabValDR[x][y]->setAlignment(Qt::AlignHCenter);

            SlidDR[x][y] = new QSlider(DR);
            ((QGridLayout*)(DR->layout()))->addWidget(SlidDR[x][y],2+x,y);
            SlidDR[x][y]->setMaximum(100);
            SlidDR[x][y]->setMinimum(0);
            SlidDR[x][y]->setValue(60);
            SlidDR[x][y]->setProperty("num",y);
            SlidDR[x][y]->setProperty("nor_id",x);
            connect( SlidDR[x][y], SIGNAL( valueChanged(int) ), this, SLOT( DRValueChanged(int) ) );
        }
    }

    for(int x=0;x<6;x++)
    {
        LabTrime[x] = new QLabel(Trime);
        ((QGridLayout*)(Trime->layout()))->addWidget(LabTrime[x],0,x);
        LabTrime[x]->setMinimumWidth(30);
        LabTrime[x]->setNum(x+1);
        LabTrime[x]->setAlignment(Qt::AlignHCenter);

        LabValTrime[x] = new QLabel(Trime);
        ((QGridLayout*)(Trime->layout()))->addWidget(LabValTrime[x],1,x);
        LabValTrime[x]->setText("0");
        LabValTrime[x]->setAlignment(Qt::AlignHCenter);

        SlidTrime[x] = new QSlider(Trime);
        ((QGridLayout*)(Trime->layout()))->addWidget(SlidTrime[x],2,x);
        SlidTrime[x]->setMaximum(120);
        SlidTrime[x]->setMinimum(-120);
        SlidTrime[x]->setValue(0);
        SlidTrime[x]->setProperty("num",x);
        connect( SlidTrime[x], SIGNAL( valueChanged(int) ), this, SLOT( TrimeValueChanged(int) ) );
    }

    for(int x=0;x<3;x++)
    {
        LabDebatement[x] = new QLabel(Debatement);
        ((QGridLayout*)(Debatement->layout()))->addWidget(LabDebatement[x],0,x);
        LabDebatement[x]->setMinimumWidth(25);
        LabDebatement[x]->setNum(x+1);
        LabDebatement[x]->setAlignment(Qt::AlignHCenter);

        LabValDebatement[x] = new QLabel(Debatement);
        ((QGridLayout*)(Debatement->layout()))->addWidget(LabValDebatement[x],1,x);
        LabValDebatement[x]->setText("60");
        LabValDebatement[x]->setAlignment(Qt::AlignHCenter);

        SlidDebatement[x] = new QSlider(Debatement);
        ((QGridLayout*)(Debatement->layout()))->addWidget(SlidDebatement[x],2,x);
        SlidDebatement[x]->setMaximum(100);
        SlidDebatement[x]->setMinimum(0);
        SlidDebatement[x]->setValue(60);
        SlidDebatement[x]->setProperty("num",x);
        connect( SlidDebatement[x], SIGNAL( valueChanged(int) ), this, SLOT( DebatementValueChanged(int) ) );
    }

    for(int x=0;x<6;x++)
    {
        LabCheckInverseur[x] = new QLabel(Inverseur);
        ((QGridLayout*)(Inverseur->layout()))->addWidget(LabCheckInverseur[x],0,x);
        LabCheckInverseur[x]->setNum(x+1);
        LabCheckInverseur[x]->setAlignment(Qt::AlignHCenter);
        CheckInverseur[x] = new QCheckBox(Inverseur);
        ((QGridLayout*)(Inverseur->layout()))->addWidget(CheckInverseur[x],1,x);
        CheckInverseur[x]->setProperty("num",x);
        CheckInverseur[x]->setMaximumWidth(24);
        connect( CheckInverseur[x], SIGNAL( stateChanged(int) ), this, SLOT( InverseurStateChanged(int) ) );
    }

    for(int x=0;x<2;x++)
    {
        for(int y=0;y<5;y++)
        {
            SpinGrapheMoteur[x][y] = new QSpinBox(gBmoteur);
            ((QGridLayout*)(GridMoteur->layout()))->addWidget(SpinGrapheMoteur[x][y],y+1,x);
            SpinGrapheMoteur[x][y]->setMaximum(100);
            SpinGrapheMoteur[x][y]->setValue(100/4*y);
            SpinGrapheMoteur[x][y]->setProperty("num",y);
            SpinGrapheMoteur[x][y]->setProperty("nor_id",x);
            connect( SpinGrapheMoteur[x][y], SIGNAL( valueChanged(int) ), this, SLOT( GrapheMoteurValueChanged(int) ) );
        }
    }
    for(int x=0;x<2;x++)
    {
        for(int y=0;y<5;y++)
        {
            SpinGraphePas[x][y] = new QSpinBox(Gpas);
            ((QGridLayout*)(GridPas->layout()))->addWidget(SpinGraphePas[x][y],y+1,x);
            SpinGraphePas[x][y]->setMaximum(100);
            SpinGraphePas[x][y]->setValue(100/4*y);
            SpinGraphePas[x][y]->setProperty("num",y);
            SpinGraphePas[x][y]->setProperty("nor_id",x);
            connect( SpinGraphePas[x][y], SIGNAL( valueChanged(int) ), this, SLOT( GraphePasValueChanged(int) ) );
        }
    }


    #define NB_ELEM_Y 7
    for(int x=0;x<3;x++)
    {
        LabMixSource[x] = new QLabel(Mix);
        LabMixSource[x]->setText("Source");
        LabMixSource[x]->setAlignment(Qt::AlignBottom);
        ((QGridLayout*)(Mix->layout()))->addWidget(LabMixSource[x],x*NB_ELEM_Y,0);
        MixSource[x] = new QComboBox(Mix);
        ((QGridLayout*)(Mix->layout()))->addWidget(MixSource[x],x*NB_ELEM_Y+1,0);
        for(int l=0;l<6;l++)
        {
            MixSource[x]->addItem("CH"+QString().setNum(l+1),QVariant(l));
        }
        MixSource[x]->addItem("WR A",QVariant(6));
        MixSource[x]->addItem("WR B",QVariant(7));
        MixSource[x]->setProperty("num",x);
        connect( MixSource[x], SIGNAL( currentIndexChanged(int) ), this, SLOT( FoncMixSource(int) ) );
        LabMixDestination[x] = new QLabel(Mix);
        LabMixDestination[x]->setText("Destination");
        LabMixDestination[x]->setAlignment(Qt::AlignBottom);
        ((QGridLayout*)(Mix->layout()))->addWidget(LabMixDestination[x],x*NB_ELEM_Y,1);
        MixDestination[x] = new QComboBox(Mix);
        ((QGridLayout*)(Mix->layout()))->addWidget(MixDestination[x],x*NB_ELEM_Y+1,1);
        for(int l=0;l<6;l++)
        {
            MixDestination[x]->addItem("CH"+QString().setNum(l+1),QVariant(l));
        }

        MixDestination[x]->setProperty("num",x);
        connect( MixDestination[x], SIGNAL( currentIndexChanged(int) ), this, SLOT( FoncMixDestination(int) ) );
        LabMixPositif[x] = new QLabel(Mix);
        LabMixPositif[x]->setText("Positif");
        LabMixPositif[x]->setAlignment(Qt::AlignBottom);
        ((QGridLayout*)(Mix->layout()))->addWidget(LabMixPositif[x],x*NB_ELEM_Y+2,0);
        MixPositif[x] = new QSpinBox(Mix);
        ((QGridLayout*)(Mix->layout()))->addWidget(MixPositif[x],x*NB_ELEM_Y+3,0);
        MixPositif[x]->setMaximum(100);
        MixPositif[x]->setMinimum(-100);
        MixPositif[x]->setProperty("num",x);
        connect( MixPositif[x], SIGNAL( valueChanged(int) ), this, SLOT( FoncMixPositif(int) ) );

        LabMixNegatif[x] = new QLabel(Mix);
        LabMixNegatif[x]->setText("Negatif");
        LabMixNegatif[x]->setAlignment(Qt::AlignBottom);
        ((QGridLayout*)(Mix->layout()))->addWidget(LabMixNegatif[x],x*NB_ELEM_Y+2,1);
        MixNegatif[x] = new QSpinBox(Mix);
        ((QGridLayout*)(Mix->layout()))->addWidget(MixNegatif[x],x*NB_ELEM_Y+3,1);
        MixNegatif[x]->setMaximum(100);
        MixNegatif[x]->setMinimum(-100);
        MixNegatif[x]->setProperty("num",x);
        connect( MixNegatif[x], SIGNAL( valueChanged(int) ), this, SLOT( FoncMixNegatif(int) ) );

        LabMixInterupteur[x] = new QLabel(Mix);
        LabMixInterupteur[x]->setText("Interupteur");
        LabMixInterupteur[x]->setAlignment(Qt::AlignBottom);
        ((QGridLayout*)(Mix->layout()))->addWidget(LabMixInterupteur[x],x*NB_ELEM_Y+4,0,1,2);
        MixInterupteur[x] = new QComboBox(Mix);
        ((QGridLayout*)(Mix->layout()))->addWidget(MixInterupteur[x],x*NB_ELEM_Y+5,0,1,2);
        MixInterupteur[x]->addItem("Interrupteur A");
        MixInterupteur[x]->addItem("Interrupteur B");
        MixInterupteur[x]->addItem("ON");
        MixInterupteur[x]->addItem("OFF");
        MixInterupteur[x]->setCurrentIndex(3);
        MixInterupteur[x]->setProperty("num",x);
        connect( MixInterupteur[x], SIGNAL( currentIndexChanged(int) ), this, SLOT( FoncMixInterupteur(int) ) );

        if(x<2)
        {
            Line[x] = new QFrame(Mix);
            ((QGridLayout*)(Mix->layout()))->addWidget(Line[x],x*NB_ELEM_Y+6,0,1,2);
            Line[x]->setFrameShape(QFrame::HLine);
            Line[x]->setFrameShadow(QFrame::Sunken);
            Line[x]->setMinimumHeight(20);
        }
    }

    for(int x=0;x<6;x++)
    {
        LabCannal[x] = new QLabel(Cannal);
        ((QGridLayout*)(Cannal->layout()))->addWidget(LabCannal[x],x*3,0);
        LabCannal[x]->setNum(x+1);
        LabCannal[x]->setAlignment(Qt::AlignHCenter);

        QbCannal[x] = new QProgressBar (Cannal);
        ((QGridLayout*)(Cannal->layout()))->addWidget(QbCannal[x],x*3+1,0);
        QbCannal[x]->setMaximum(1024);
        QbCannal[x]->setSizePolicy(QSizePolicy::Minimum,QSizePolicy::Fixed);

        QsCannal[x] = new QSpacerItem(10, 20, QSizePolicy::Minimum, QSizePolicy::Expanding);
        ((QGridLayout*)(Cannal->layout()))->addItem(QsCannal[x],x*3+2,0);
    }

    Type->addItem("Avion",QVariant(0));
    Type->addItem("Heli 120",QVariant(1));
    Type->addItem("Heli 90",QVariant(2));
    Type->addItem("Heli 140",QVariant(3));
    connect( Type, SIGNAL( currentIndexChanged (int) ), this, SLOT( TypeCurrentIndexChanged(int) ) );

    Mode->addItem("Mode 1",QVariant(0));
    Mode->addItem("Mode 2",QVariant(1));
    Mode->addItem("Mode 3",QVariant(2));
    Mode->addItem("Mode 4",QVariant(3));
    connect( Mode, SIGNAL( currentIndexChanged (int) ), this, SLOT( ModeCurrentIndexChanged(int) ) );

    InterupteurA->addItem("OFF",QVariant(0));
    InterupteurA->addItem("DR",QVariant(1));
    InterupteurA->addItem("ThroCut",QVariant(2));
    InterupteurA->addItem("NOR-ID",QVariant(3));
    connect( InterupteurA, SIGNAL( currentIndexChanged(int) ), this, SLOT( FoncInterupteurA(int) ) );
    InterupteurB->addItem("OFF",QVariant(0));
    InterupteurB->addItem("DR",QVariant(1));
    InterupteurB->addItem("ThroCut",QVariant(2));
    InterupteurB->addItem("Nor-ID",QVariant(3));
    connect( InterupteurB, SIGNAL( currentIndexChanged(int) ), this, SLOT( FoncInterupteurB(int) ) );
    PotA->addItem("OFF",QVariant(0));
    PotA->addItem("Pith Adjust",QVariant(1));
    connect( PotA, SIGNAL( currentIndexChanged(int) ), this, SLOT( FoncPotA(int) ) );
    PotB->addItem("OFF",QVariant(0));
    PotB->addItem("Pith Adjust",QVariant(1));
    connect( PotB, SIGNAL( currentIndexChanged(int) ), this, SLOT( FoncPotB(int) ) );
    connect( TimeEnvoyer, SIGNAL( timeChanged(const QTime &) ), this, SLOT( FoncTimeEnvoyer(const QTime &) ) );
    timer = new QTimer(this);
    connect( timer, SIGNAL(timeout()), this, SLOT( FoncEnvoyer() ) );
    connect( CBPort, SIGNAL( editTextChanged(const QString &) ), this, SLOT( FoncNewCBPort(const QString &) ) );
    connect( Envoyer, SIGNAL( released() ), this, SLOT( FoncEnvoyer() ) );

    connect( actionCharger, SIGNAL( triggered() ), this, SLOT( FoncCharger() ) );
    connect( actionEnregistr, SIGNAL( triggered() ), this, SLOT( FoncEnregistr() ) );
    connect( actionEnregistrerSous, SIGNAL( triggered() ), this, SLOT( FoncEnregistrSous() ) );
    connect( actionImporter, SIGNAL( triggered() ), this, SLOT( FoncImport() ) );
    connect( actionExporter, SIGNAL( triggered() ), this, SLOT( FoncExport() ) );
    connect( actionExporter, SIGNAL( triggered() ), this, SLOT( FoncExport() ) );
    connect( actionA_propos, SIGNAL( triggered() ), this, SLOT( FoncA_propos() ) );

    connect(  CheckInverseur[2], SIGNAL( stateChanged( int ) ), this, SLOT( StateChangedInverseur3( int ) ) );

    setTabOrder(Type, Mode);
    setTabOrder(Mode, InterupteurA);
    setTabOrder(InterupteurA, InterupteurB);
    setTabOrder(InterupteurB, PotA);
    setTabOrder(PotA, PotB);
    setTabOrder(PotB, CBPort);
    setTabOrder(CBPort, Envoyer);
    setTabOrder(Envoyer, TimeEnvoyer);

    QFile file(QDir::home().path()+"/.confiture");
    file.open(QIODevice::ReadOnly);
    temp=file.read(500);
    if(temp=="")
    {
        fichier_courant=QDir::home().path();
    }
    else
    {
        fichier_courant=QString(temp);
        load(fichier_courant,0);
    }
#ifndef _TTY_POSIX_
    QApplication::setStyle("plastique");

    CBPort->setEditable(0);
    CBPort->clear();
    for(int l=1;l<=9;l++)
    {
        CBPort->addItem("COM"+QString().setNum(l));
    }
#endif
    CBPort->setEditText(file.read(500));

    SceneMoteur = new QGraphicsScene();
    ViewMoteur = new QGraphicsView (SceneMoteur);
    ViewMoteur->setParent(GraphMoteur);
    ViewMoteur->setRenderHints(QPainter::Antialiasing);
    for(int x=0;x<5;x++)
    {
        SceneMoteur->addItem(&LineGrilleMoteur[0][x]);
        SceneMoteur->addItem(&LineGrilleMoteur[1][x]);
    }
    for(int x=0;x<4;x++)
    {
        SceneMoteur->addItem(&LineGrapheMoteur[0][x]);
        LineGrapheMoteur[0][x].setPen(QPen(QColor(Qt::blue)));
        SceneMoteur->addItem(&LineGrapheMoteur[1][x]);
        LineGrapheMoteur[1][x].setPen(QPen(QColor(Qt::red)));
    }
    SceneMoteur->setSceneRect(0,0,121,121);

    ScenePas = new QGraphicsScene();
    ViewPas = new QGraphicsView (ScenePas);
    ViewPas->setParent(GraphPas);
    ViewPas->setRenderHints(QPainter::Antialiasing);
    for(int x=0;x<5;x++)
    {
        ScenePas->addItem(&LineGrillePas[0][x]);
        ScenePas->addItem(&LineGrillePas[1][x]);
    }
    for(int x=0;x<4;x++)
    {
        ScenePas->addItem(&LineGraphePas[0][x]);
        LineGraphePas[0][x].setPen(QPen(QColor(Qt::blue)));
        ScenePas->addItem(&LineGraphePas[1][x]);
        LineGraphePas[1][x].setPen(QPen(QColor(Qt::red)));
    }
    ScenePas->setSceneRect(0,0,121,121);

    FoncNewCBPort(CBPort->currentText());

    GrapheMoteurValueChanged(-1);
    GraphePasValueChanged(-1);
}

MYTreadReadUart::MYTreadReadUart(QObject *parent)
{
    setParent(parent);
}

void MainWindowImpl::DrawChannel()
{
    for(int l=0;l<6;l++)
    {
        QbCannal[l]->setValue(channel[l]);
    }
}

void MainWindowImpl::StateChangedInverseur3( int state)
{
    timer->stop();
    if(state && QMessageBox::warning(this, "atention",
                                QString::fromUtf8("Êtes vous sûr de vouloir modifier l'inversion du cannal 3. \nCela pourrait faire démarrer le moteur."),
                                QMessageBox::Yes|QMessageBox::No,
                                QMessageBox::No)==QMessageBox::No)
    {
      CheckInverseur[2]->setCheckState(Qt::Unchecked);
    }
    timer->start();
}

void MainWindowImpl::FoncNewCBPort(const QString & text)
{
    TreadRead->stop=1;
    while(TreadRead->isRunning());
    if(port->isOpen())
        port->close();
    port->setPortName(text);
    port->setBaudRate(BAUD115200);
    port->setFlowControl(FLOW_OFF);
    port->setParity(PAR_NONE);
    port->setDataBits(DATA_8);
    port->setStopBits(STOP_1);
    port->setTimeout(0,1);
    port->open(QIODevice::ReadWrite);
    if(port->isOpen())
    {
        TreadRead->start();
        TreadRead->setPriority(QThread::LowestPriority);
        statusbar->showMessage("Port ouvert");
    }
    else
    {
        statusbar->showMessage(QString::fromUtf8("Port fermé"));
    }
}

void MYTreadReadUart::run()
{
    QString string("");
    char DataR[100];
    unsigned int NbData;
    unsigned int start=0;
    int numdata=0;
    int val;
    stop=0;
    while(!stop)
    {
        usleep(1);
        NbData=((MainWindowImpl*)parent())->port->read(DataR,100);
        for(int l=0;l<NbData;l++)
        {
            if((start==1) && ((unsigned char)DataR[l]==0xFC))
            {
                start=2;
                string="";
                numdata=0;
            }
            if((unsigned char)DataR[l]==0x55 && start==0)
                start=1;

            if((start==2) && (string.length()<30))
            {
                if((numdata-1)%2==0)
                {
                    val=(unsigned char)DataR[l]<<8;
                }
                else
                {
                    val+=(unsigned char)DataR[l];
                    ((MainWindowImpl*)parent())->channel[(numdata-1)/2]=(val-1000);
                    if((numdata-1)/2>=5)
                    {
                        emit SignalsDrawChannel();
                        start=0;
                    }

                }
                numdata++;
            }
        }
    }
}


void MainWindowImpl::FinDeCourseValueChanged(int val)
{
    int x=((QSlider*)sender())->property("num").toInt();
    int y=((QSlider*)sender())->property("haut_bas").toInt();
    if(y==0)
    {
        LabValFinDeCourse[x][y]->setNum(val);
        tab[13+y+x*2]=val;
    }
    else
    {
        LabValFinDeCourse[x][y]->setNum(120-val);
        tab[13+y+x*2]=120-val;
    }

}

void MainWindowImpl::GrapheMoteurValueChanged(int val)
{
    int num;
    int nor_id;
    QPointF pointsMoteur[2][5];

    if(val>=0)
    {
        num=((QSlider*)sender())->property("num").toInt();
        nor_id=((QSlider*)sender())->property("nor_id").toInt();
        tab[25+nor_id+num*2]=val;
    }
    for(int x=0;x<5;x++)
    {
        for(int y=0;y<2;y++)
        {
            pointsMoteur[y][x]=QPointF((int)(GraphMoteur->geometry().width()-5)/4.0*x,
                                       (int)(GraphMoteur->geometry().height()-5)/100.0*(100-tab[25+y+x*2]));
        }
    }
    DrawGraphe(pointsMoteur, LineGrilleMoteur, LineGrapheMoteur);
}



void MainWindowImpl::DrawGraphe(QPointF points[2][5], QGraphicsLineItem LineGrille[2][5],QGraphicsLineItem LineGraphe[2][4])
{
    for(int x=0;x<5;x++)
    {
        LineGrille[0][x].setLine(((GraphPas->geometry().width()-5)/4.0*x)+0.5,
                                 0,
                                 ((GraphPas->geometry().width()-5)/4.0*x)+0.5,
                                 (int)((GraphPas->geometry().height()-5)));
        LineGrille[1][x].setLine(0,
                                 (int)(GraphPas->geometry().height()-5)/4.0*x+0.5,
                                 (int)(GraphPas->geometry().width()-5),
                                 (int)(GraphPas->geometry().height()-5)/4.0*x+0.5);
    }
    for(int x=0;x<4;x++)
    {
        LineGraphe[0][x].setLine((int)points[0][x].x(),(int)points[0][x].y(),(int)points[0][x+1].x(),(int)points[0][x+1].y());
        LineGraphe[1][x].setLine((int)points[1][x].x(),(int)points[1][x].y(),(int)points[1][x+1].x(),(int)points[1][x+1].y());
    }
}

void MainWindowImpl::GraphePasValueChanged(int val)
{
    int num;
    int nor_id;
    QPointF pointsPas[2][5];

    if(val>=0)
    {
        num=((QSlider*)sender())->property("num").toInt();
        nor_id=((QSlider*)sender())->property("nor_id").toInt();
        tab[35+nor_id+num*2]=val;
    }
    for(int x=0;x<5;x++)
    {
        for(int y=0;y<2;y++)
        {
            pointsPas[y][x]=QPointF((int)(GraphPas->geometry().width()-5)/4.0*x,
                                    (int)(GraphPas->geometry().height()-5)/100.0*(100-tab[35+y+x*2]));
        }
    }
    DrawGraphe(pointsPas,LineGrillePas,LineGraphePas);
}

void  MainWindowImpl::InverseurStateChanged(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    if(val)
        tab[3]|=0x01<<num;
    else
        tab[3]&=~(0x01<<num);
}

void MainWindowImpl::TrimeValueChanged(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    tab[45+num]=val;
    printf("%x %x\n",val,tab[45+num]);
    LabValTrime[num]->setNum(val);
}

void MainWindowImpl::TypeCurrentIndexChanged(int val)
{
    tab[2]=(tab[2]&0xF0)|val;
}

void MainWindowImpl::ModeCurrentIndexChanged(int val)
{
    tab[2]=(tab[2]&0x0F)|(val<<4);
}

void MainWindowImpl::FoncInterupteurA(int val)
{
    tab[63]=val;
}
void MainWindowImpl::FoncInterupteurB(int val)
{
    tab[64]=val;
}
void MainWindowImpl::FoncPotA(int val)
{
    tab[65]=val;
}
void MainWindowImpl::FoncPotB(int val)
{
    tab[66]=val;
}

void MainWindowImpl::FoncMixSource(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    tab[51+num*4]=(tab[51+num*4]&0x0F)|(val<<4);
}

void MainWindowImpl::FoncMixDestination(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    tab[51+num*4]=(tab[51+num*4]&0xF0)|val;
}

void MainWindowImpl::FoncMixPositif(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    tab[52+num*4]=val;
}

void MainWindowImpl::FoncMixNegatif(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    tab[53+num*4]=val;
}

void MainWindowImpl::FoncMixInterupteur(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    tab[54+num*4]=val;
}

void MainWindowImpl::FoncTimeEnvoyer(const QTime & val)
{
    if(QTime().msecsTo(val)>0)
    {
        if(QTime().msecsTo(val)<200)
           timer->start(200);
        else
            timer->start(QTime().msecsTo(val));
    }
    else
    {
        timer->stop();
    }
}

void MainWindowImpl::DebatementValueChanged(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    tab[10+num]=val;
    LabValDebatement[num]->setNum(val);
}

void MainWindowImpl::DRValueChanged(int val)
{
    int num=((QSlider*)sender())->property("num").toInt();
    int nor_id=((QSlider*)sender())->property("nor_id").toInt();
    tab[4+nor_id+num*2]=val;
    LabValDR[nor_id][num]->setNum(val);
}

void MainWindowImpl::FoncCharger()
{
    QString chem;
    chem = QFileDialog::getOpenFileName(this, "Open file", fichier_courant, "config (*.cft);; All (*)");
    if(chem!=NULL)
    {
        load(chem,0);
        fichier_courant=chem;
    }
}

void MainWindowImpl::FoncEnregistr()
{
    QString chem;
    if(fichier_courant.right(4)!=".cft")
    {
        chem = QFileDialog::getSaveFileName(this, "Open file", fichier_courant, "config (*.cft)");
    }
    else
    {
        chem = fichier_courant;
    }
    if(chem!=NULL)
    {
        save(chem,0);
        fichier_courant=chem;
    }
}

void MainWindowImpl::FoncEnregistrSous()
{
    QString chem;
    chem = QFileDialog::getSaveFileName(this, "Open file", fichier_courant, "config (*.cft)" ,0 ,QFileDialog::DontConfirmOverwrite);
    if((chem!=NULL)&&(chem.right(4)!=".cft"))
        chem+=".cft";
    if(QFile::exists(chem))
    {
        if(QMessageBox::warning(this, "atention",
                                "le fichier existe deja voulez vous le remplacer?",
                                QMessageBox::Ok|QMessageBox::Cancel,
                                QMessageBox::Ok)==QMessageBox::Cancel)
            chem.clear();
    }
    if(chem!=NULL)
    {
        if(chem.right(4)!=".cft")
            chem+=".cft";
        save(chem,0);
        fichier_courant=chem;
    }
}

void MainWindowImpl::FoncImport()
{
    QString chem;
    chem = QFileDialog::getOpenFileName(this, "Open file", fichier_courant, "All (*)");
    if(chem!=NULL)
    {
        load(chem,1);
    }
}

void MainWindowImpl::FoncExport()
{
    QString chem;
    chem = QFileDialog::getSaveFileName(this, "Open file", fichier_courant, "all (*.*)");
    if(chem!=NULL)
    {
        save(chem,1);
    }
}

void MainWindowImpl::save(QString chem,bool export_)
{
    QFile file(chem);
    file.open(QIODevice::WriteOnly);
    if(export_)
    {
        if(file.write(tab+2,65)!=65)
            QMessageBox::warning(this, QString::fromUtf8("Érreur"),
                                 tr("Impossible d'enregistrer!"),
                                 QMessageBox::Ok,
                                 QMessageBox::Ok);
    }
    else
    {
        if(file.write(tab,69)!=69)
            QMessageBox::warning(this, QString::fromUtf8("Érreur"),
                                 tr("Impossible d'enregistrer!"),
                                 QMessageBox::Ok,
                                 QMessageBox::Ok);
    }
}

bool MainWindowImpl::load(QString chem,bool import)
{
    QFile file(chem);
    file.open(QIODevice::ReadOnly);
    if(import)
    {
        tab[0]=0x55;
        tab[1]=0xff;
        if(file.read(tab+2,65)!=65)
        {
            QMessageBox::warning(this, QString::fromUtf8("Érreur"),
                                 tr("Impossible de charger!"),
                                 QMessageBox::Ok,
                                 QMessageBox::Ok);
            return 0;
        }
    }
    else
    {
        if(file.read(tab,69)!=69)
        {
            QMessageBox::warning(this, QString::fromUtf8("Érreur"),
                                 tr("Impossible de charger!"),
                                 QMessageBox::Ok,
                                 QMessageBox::Ok);
            return 0;
        }
    }
    Type->setCurrentIndex(tab[2]&0x0F);
    Mode->setCurrentIndex((tab[2]&0xF0)>>4);
    for(int l=0;l<6;l++)
    {
        CheckInverseur[l]->setChecked(tab[3]&(0x01<<l));
    }
    for(int x=0;x<3;x++)
    {
        for(int y=0;y<2;y++)
        {
            LabValDR[y][x]->setNum(tab[4+y+x*2]);
            SlidDR[y][x]->setValue(tab[4+y+x*2]);
        }
    }
    for(int x=0;x<3;x++)
    {
        LabValDebatement[x]->setNum(tab[10+x]);
        SlidDebatement[x]->setValue(tab[10+x]);
    }
    for(int x=0;x<6;x++)
    {
        for(int y=0;y<2;y++)
        {
            LabValFinDeCourse[x][y]->setNum(tab[13+y+x*2]);
            if(y==0)
                SlidFinDeCourse[x][y]->setValue(tab[13+y+x*2]);
            else
                SlidFinDeCourse[x][y]->setValue(120-tab[13+y+x*2]);
        }
    }
    for(int x=0;x<5;x++)
    {
        SpinGrapheMoteur[0][x]->setValue(tab[25+x*2]);
        SpinGrapheMoteur[1][x]->setValue(tab[26+x*2]);
        SpinGraphePas[0][x]->setValue(tab[35+x*2]);
        SpinGraphePas[1][x]->setValue(tab[36+x*2]);
    }

    for(int x=0;x<6;x++)
    {
        LabValTrime[x]->setNum(tab[45+x]);
        SlidTrime[x]->setValue(tab[45+x]);
    }
    for(int x=0;x<3;x++)
    {
        MixSource[x]->setCurrentIndex((tab[51+x*4]&0xF0)>>4);
        MixDestination[x]->setCurrentIndex(tab[51+x*4]&0x0F);
        MixPositif[x]->setValue(tab[52+x*4]);
        MixNegatif[x]->setValue(tab[53+x*4]);
        MixInterupteur[x]->setCurrentIndex(tab[54+x*4]);
    }
    InterupteurA->setCurrentIndex(tab[63]);
    InterupteurB->setCurrentIndex(tab[64]);
    PotA->setCurrentIndex(tab[65]);
    PotB->setCurrentIndex(tab[66]);
    return 1;
}

void MainWindowImpl::FoncEnvoyer()
{
    unsigned int somme=0;
    if(port->isOpen())
    {
        for(int l=2;l<67;l++)
        {
            somme+=(unsigned char)tab[l];
        }
        tab[67]=somme>>8;
        tab[68]=somme;

        if(port->write(tab,69)!=69)
            QMessageBox::warning(this, QString::fromUtf8("Érreur"),
                                 tr("Impossible d'envoyer sur le port serie!"),
                                 QMessageBox::Ok,
                                 QMessageBox::Ok);
        port->flush();
    }
    else
    {
         QMessageBox::warning(this, QString::fromUtf8("Érreur"),
                                 tr("Impossible d'envoyer sur le port serie!"),
                                 QMessageBox::Ok,
                                 QMessageBox::Ok);
    }
}

void MainWindowImpl::FoncA_propos()
{
    QMessageBox::information( this, QString::fromUtf8("À propos"),
        QString::fromUtf8("Confiture V2.0 \n\n\
Cette application permet de programmer les télécommandes \n\
Turborix 2.4ghz, FLY SKY CT6A, Hobby King et autres copies \n\n\
Auteur: Simon Fourquier \nEmail: simoncortex-helico@yahoo.fr"),
        "&OK");
}

MainWindowImpl::~MainWindowImpl()
{
    QFile file(QDir::home().path()+"/.confiture");
    file.open(QIODevice::WriteOnly);
    file.write(fichier_courant.toAscii(),500);
    file.write(CBPort->currentText().toAscii(),500);
}


