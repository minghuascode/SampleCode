/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created: Tue May 25 13:03:36 2010
**      by: Qt User Interface Compiler version 4.6.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtGui/QAction>
#include <QtGui/QApplication>
#include <QtGui/QButtonGroup>
#include <QtGui/QComboBox>
#include <QtGui/QFrame>
#include <QtGui/QGridLayout>
#include <QtGui/QGroupBox>
#include <QtGui/QHBoxLayout>
#include <QtGui/QHeaderView>
#include <QtGui/QLabel>
#include <QtGui/QMainWindow>
#include <QtGui/QMenu>
#include <QtGui/QMenuBar>
#include <QtGui/QPushButton>
#include <QtGui/QScrollArea>
#include <QtGui/QSpacerItem>
#include <QtGui/QStatusBar>
#include <QtGui/QTimeEdit>
#include <QtGui/QVBoxLayout>
#include <QtGui/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QAction *actionEnregistr;
    QAction *actionCharger;
    QAction *actionConfiguration;
    QAction *actionEnregistrerSous;
    QAction *actionImporter;
    QAction *actionExporter;
    QAction *actionA_propos;
    QWidget *centralwidget;
    QGridLayout *gridLayout_2;
    QScrollArea *scrollArea;
    QWidget *scrollAreaWidgetContents;
    QGridLayout *gridLayout;
    QVBoxLayout *verticalLayout_2;
    QGroupBox *Cannal;
    QGridLayout *gridLayout_9;
    QSpacerItem *verticalSpacer_12;
    QGridLayout *gridLayout_4;
    QGroupBox *DR;
    QGridLayout *gridLayout_5;
    QGroupBox *Trime;
    QGridLayout *gridLayout_6;
    QGroupBox *Debatement;
    QGridLayout *gridLayout_7;
    QGroupBox *FinDeCourse;
    QGridLayout *gridLayout_3;
    QGroupBox *Inverseur;
    QGridLayout *gridLayout_10;
    QGroupBox *Mix;
    QGridLayout *gridLayout_8;
    QVBoxLayout *verticalLayout_3;
    QLabel *label;
    QComboBox *Type;
    QSpacerItem *verticalSpacer_5;
    QLabel *label_2;
    QComboBox *Mode;
    QSpacerItem *verticalSpacer_6;
    QLabel *label_3;
    QComboBox *InterupteurA;
    QSpacerItem *verticalSpacer_7;
    QLabel *label_4;
    QComboBox *InterupteurB;
    QSpacerItem *verticalSpacer_8;
    QLabel *label_5;
    QComboBox *PotA;
    QSpacerItem *verticalSpacer_9;
    QLabel *label_6;
    QComboBox *PotB;
    QSpacerItem *verticalSpacer_10;
    QLabel *label_7;
    QComboBox *CBPort;
    QSpacerItem *verticalSpacer_11;
    QPushButton *Envoyer;
    QLabel *label_8;
    QHBoxLayout *horizontalLayout_5;
    QTimeEdit *TimeEnvoyer;
    QLabel *label_9;
    QGroupBox *gBmoteur;
    QHBoxLayout *horizontalLayout_4;
    QGridLayout *GridMoteur;
    QLabel *label_11;
    QLabel *label_10;
    QVBoxLayout *Gmoteur;
    QSpacerItem *verticalSpacer;
    QFrame *GraphMoteur;
    QSpacerItem *verticalSpacer_2;
    QGroupBox *Gpas;
    QHBoxLayout *horizontalLayout_6;
    QGridLayout *GridPas;
    QLabel *label_12;
    QLabel *label_13;
    QVBoxLayout *verticalLayout_5;
    QSpacerItem *verticalSpacer_3;
    QFrame *GraphPas;
    QSpacerItem *verticalSpacer_4;
    QMenuBar *menubar;
    QMenu *menuFichier;
    QMenu *menuhelp;
    QStatusBar *statusbar;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QString::fromUtf8("MainWindow"));
        MainWindow->resize(950, 580);
        MainWindow->setMinimumSize(QSize(100, 100));
        MainWindow->setMaximumSize(QSize(10000, 10000));
        MainWindow->setAnimated(true);
        MainWindow->setDockOptions(QMainWindow::AllowTabbedDocks|QMainWindow::AnimatedDocks);
        MainWindow->setUnifiedTitleAndToolBarOnMac(false);
        actionEnregistr = new QAction(MainWindow);
        actionEnregistr->setObjectName(QString::fromUtf8("actionEnregistr"));
        actionCharger = new QAction(MainWindow);
        actionCharger->setObjectName(QString::fromUtf8("actionCharger"));
        actionConfiguration = new QAction(MainWindow);
        actionConfiguration->setObjectName(QString::fromUtf8("actionConfiguration"));
        actionEnregistrerSous = new QAction(MainWindow);
        actionEnregistrerSous->setObjectName(QString::fromUtf8("actionEnregistrerSous"));
        actionImporter = new QAction(MainWindow);
        actionImporter->setObjectName(QString::fromUtf8("actionImporter"));
        actionExporter = new QAction(MainWindow);
        actionExporter->setObjectName(QString::fromUtf8("actionExporter"));
        actionA_propos = new QAction(MainWindow);
        actionA_propos->setObjectName(QString::fromUtf8("actionA_propos"));
        centralwidget = new QWidget(MainWindow);
        centralwidget->setObjectName(QString::fromUtf8("centralwidget"));
        centralwidget->setMinimumSize(QSize(0, 0));
        gridLayout_2 = new QGridLayout(centralwidget);
        gridLayout_2->setSpacing(0);
        gridLayout_2->setContentsMargins(0, 0, 0, 0);
        gridLayout_2->setObjectName(QString::fromUtf8("gridLayout_2"));
        scrollArea = new QScrollArea(centralwidget);
        scrollArea->setObjectName(QString::fromUtf8("scrollArea"));
        scrollArea->setContextMenuPolicy(Qt::DefaultContextMenu);
        scrollArea->setLayoutDirection(Qt::LeftToRight);
        scrollArea->setAutoFillBackground(true);
        scrollArea->setFrameShape(QFrame::NoFrame);
        scrollArea->setWidgetResizable(true);
        scrollArea->setAlignment(Qt::AlignLeading|Qt::AlignLeft|Qt::AlignTop);
        scrollAreaWidgetContents = new QWidget();
        scrollAreaWidgetContents->setObjectName(QString::fromUtf8("scrollAreaWidgetContents"));
        scrollAreaWidgetContents->setGeometry(QRect(0, 0, 950, 533));
        gridLayout = new QGridLayout(scrollAreaWidgetContents);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        verticalLayout_2 = new QVBoxLayout();
        verticalLayout_2->setSpacing(0);
        verticalLayout_2->setContentsMargins(1, 1, 1, 1);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        Cannal = new QGroupBox(scrollAreaWidgetContents);
        Cannal->setObjectName(QString::fromUtf8("Cannal"));
        Cannal->setMaximumSize(QSize(16777215, 350));
        Cannal->setAlignment(Qt::AlignHCenter|Qt::AlignTop);
        Cannal->setFlat(false);
        Cannal->setCheckable(false);
        gridLayout_9 = new QGridLayout(Cannal);
        gridLayout_9->setSpacing(0);
        gridLayout_9->setContentsMargins(1, 1, 1, 1);
        gridLayout_9->setObjectName(QString::fromUtf8("gridLayout_9"));

        verticalLayout_2->addWidget(Cannal);

        verticalSpacer_12 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_2->addItem(verticalSpacer_12);


        gridLayout->addLayout(verticalLayout_2, 0, 0, 2, 1);

        gridLayout_4 = new QGridLayout();
        gridLayout_4->setContentsMargins(1, 1, 1, 1);
        gridLayout_4->setObjectName(QString::fromUtf8("gridLayout_4"));
        gridLayout_4->setSizeConstraint(QLayout::SetDefaultConstraint);
        DR = new QGroupBox(scrollAreaWidgetContents);
        DR->setObjectName(QString::fromUtf8("DR"));
        gridLayout_5 = new QGridLayout(DR);
        gridLayout_5->setContentsMargins(1, 1, 1, 1);
        gridLayout_5->setObjectName(QString::fromUtf8("gridLayout_5"));
        gridLayout_5->setHorizontalSpacing(0);
        gridLayout_5->setVerticalSpacing(2);

        gridLayout_4->addWidget(DR, 0, 3, 1, 1);

        Trime = new QGroupBox(scrollAreaWidgetContents);
        Trime->setObjectName(QString::fromUtf8("Trime"));
        gridLayout_6 = new QGridLayout(Trime);
        gridLayout_6->setContentsMargins(1, 1, 1, 1);
        gridLayout_6->setObjectName(QString::fromUtf8("gridLayout_6"));
        gridLayout_6->setHorizontalSpacing(0);
        gridLayout_6->setVerticalSpacing(2);

        gridLayout_4->addWidget(Trime, 1, 2, 1, 1);

        Debatement = new QGroupBox(scrollAreaWidgetContents);
        Debatement->setObjectName(QString::fromUtf8("Debatement"));
        gridLayout_7 = new QGridLayout(Debatement);
        gridLayout_7->setContentsMargins(1, 1, 1, 1);
        gridLayout_7->setObjectName(QString::fromUtf8("gridLayout_7"));
        gridLayout_7->setHorizontalSpacing(0);
        gridLayout_7->setVerticalSpacing(2);

        gridLayout_4->addWidget(Debatement, 1, 3, 1, 1);

        FinDeCourse = new QGroupBox(scrollAreaWidgetContents);
        FinDeCourse->setObjectName(QString::fromUtf8("FinDeCourse"));
        FinDeCourse->setBaseSize(QSize(0, 0));
        gridLayout_3 = new QGridLayout(FinDeCourse);
        gridLayout_3->setContentsMargins(1, 1, 1, 1);
        gridLayout_3->setObjectName(QString::fromUtf8("gridLayout_3"));
        gridLayout_3->setSizeConstraint(QLayout::SetDefaultConstraint);
        gridLayout_3->setHorizontalSpacing(0);
        gridLayout_3->setVerticalSpacing(2);

        gridLayout_4->addWidget(FinDeCourse, 0, 2, 1, 1);

        Inverseur = new QGroupBox(scrollAreaWidgetContents);
        Inverseur->setObjectName(QString::fromUtf8("Inverseur"));
        Inverseur->setMaximumSize(QSize(16777215, 100000));
        Inverseur->setBaseSize(QSize(0, 0));
        gridLayout_10 = new QGridLayout(Inverseur);
        gridLayout_10->setSpacing(0);
        gridLayout_10->setContentsMargins(1, 1, 1, 1);
        gridLayout_10->setObjectName(QString::fromUtf8("gridLayout_10"));

        gridLayout_4->addWidget(Inverseur, 2, 2, 1, 2);

        gridLayout_4->setRowStretch(0, 7);
        gridLayout_4->setRowStretch(1, 4);
        gridLayout_4->setRowStretch(2, 1);
        gridLayout_4->setColumnStretch(2, 4);
        gridLayout_4->setColumnStretch(3, 2);

        gridLayout->addLayout(gridLayout_4, 0, 1, 2, 1);

        Mix = new QGroupBox(scrollAreaWidgetContents);
        Mix->setObjectName(QString::fromUtf8("Mix"));
        gridLayout_8 = new QGridLayout(Mix);
        gridLayout_8->setSpacing(2);
        gridLayout_8->setContentsMargins(1, 1, 1, 1);
        gridLayout_8->setObjectName(QString::fromUtf8("gridLayout_8"));

        gridLayout->addWidget(Mix, 0, 3, 2, 1);

        verticalLayout_3 = new QVBoxLayout();
        verticalLayout_3->setSpacing(0);
        verticalLayout_3->setContentsMargins(1, 1, 1, 1);
        verticalLayout_3->setObjectName(QString::fromUtf8("verticalLayout_3"));
        label = new QLabel(scrollAreaWidgetContents);
        label->setObjectName(QString::fromUtf8("label"));
        label->setMinimumSize(QSize(0, 12));

        verticalLayout_3->addWidget(label);

        Type = new QComboBox(scrollAreaWidgetContents);
        Type->setObjectName(QString::fromUtf8("Type"));

        verticalLayout_3->addWidget(Type);

        verticalSpacer_5 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_3->addItem(verticalSpacer_5);

        label_2 = new QLabel(scrollAreaWidgetContents);
        label_2->setObjectName(QString::fromUtf8("label_2"));
        label_2->setMinimumSize(QSize(0, 12));

        verticalLayout_3->addWidget(label_2);

        Mode = new QComboBox(scrollAreaWidgetContents);
        Mode->setObjectName(QString::fromUtf8("Mode"));

        verticalLayout_3->addWidget(Mode);

        verticalSpacer_6 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_3->addItem(verticalSpacer_6);

        label_3 = new QLabel(scrollAreaWidgetContents);
        label_3->setObjectName(QString::fromUtf8("label_3"));
        label_3->setMinimumSize(QSize(0, 12));

        verticalLayout_3->addWidget(label_3);

        InterupteurA = new QComboBox(scrollAreaWidgetContents);
        InterupteurA->setObjectName(QString::fromUtf8("InterupteurA"));

        verticalLayout_3->addWidget(InterupteurA);

        verticalSpacer_7 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_3->addItem(verticalSpacer_7);

        label_4 = new QLabel(scrollAreaWidgetContents);
        label_4->setObjectName(QString::fromUtf8("label_4"));
        label_4->setMinimumSize(QSize(0, 12));

        verticalLayout_3->addWidget(label_4);

        InterupteurB = new QComboBox(scrollAreaWidgetContents);
        InterupteurB->setObjectName(QString::fromUtf8("InterupteurB"));

        verticalLayout_3->addWidget(InterupteurB);

        verticalSpacer_8 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_3->addItem(verticalSpacer_8);

        label_5 = new QLabel(scrollAreaWidgetContents);
        label_5->setObjectName(QString::fromUtf8("label_5"));
        label_5->setMinimumSize(QSize(0, 12));

        verticalLayout_3->addWidget(label_5);

        PotA = new QComboBox(scrollAreaWidgetContents);
        PotA->setObjectName(QString::fromUtf8("PotA"));

        verticalLayout_3->addWidget(PotA);

        verticalSpacer_9 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_3->addItem(verticalSpacer_9);

        label_6 = new QLabel(scrollAreaWidgetContents);
        label_6->setObjectName(QString::fromUtf8("label_6"));
        label_6->setMinimumSize(QSize(0, 12));

        verticalLayout_3->addWidget(label_6);

        PotB = new QComboBox(scrollAreaWidgetContents);
        PotB->setObjectName(QString::fromUtf8("PotB"));

        verticalLayout_3->addWidget(PotB);

        verticalSpacer_10 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_3->addItem(verticalSpacer_10);

        label_7 = new QLabel(scrollAreaWidgetContents);
        label_7->setObjectName(QString::fromUtf8("label_7"));
        label_7->setMinimumSize(QSize(0, 12));

        verticalLayout_3->addWidget(label_7);

        CBPort = new QComboBox(scrollAreaWidgetContents);
        CBPort->setObjectName(QString::fromUtf8("CBPort"));
        CBPort->setEditable(true);

        verticalLayout_3->addWidget(CBPort);

        verticalSpacer_11 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_3->addItem(verticalSpacer_11);

        Envoyer = new QPushButton(scrollAreaWidgetContents);
        Envoyer->setObjectName(QString::fromUtf8("Envoyer"));

        verticalLayout_3->addWidget(Envoyer);

        label_8 = new QLabel(scrollAreaWidgetContents);
        label_8->setObjectName(QString::fromUtf8("label_8"));
        label_8->setMinimumSize(QSize(0, 30));

        verticalLayout_3->addWidget(label_8);

        horizontalLayout_5 = new QHBoxLayout();
        horizontalLayout_5->setSpacing(0);
        horizontalLayout_5->setContentsMargins(1, 1, 1, 1);
        horizontalLayout_5->setObjectName(QString::fromUtf8("horizontalLayout_5"));
        TimeEnvoyer = new QTimeEdit(scrollAreaWidgetContents);
        TimeEnvoyer->setObjectName(QString::fromUtf8("TimeEnvoyer"));
        TimeEnvoyer->setCurrentSection(QDateTimeEdit::SecondSection);

        horizontalLayout_5->addWidget(TimeEnvoyer);

        label_9 = new QLabel(scrollAreaWidgetContents);
        label_9->setObjectName(QString::fromUtf8("label_9"));

        horizontalLayout_5->addWidget(label_9);


        verticalLayout_3->addLayout(horizontalLayout_5);


        gridLayout->addLayout(verticalLayout_3, 0, 4, 2, 1);

        gBmoteur = new QGroupBox(scrollAreaWidgetContents);
        gBmoteur->setObjectName(QString::fromUtf8("gBmoteur"));
        horizontalLayout_4 = new QHBoxLayout(gBmoteur);
        horizontalLayout_4->setContentsMargins(1, 1, 1, 1);
        horizontalLayout_4->setObjectName(QString::fromUtf8("horizontalLayout_4"));
        GridMoteur = new QGridLayout();
        GridMoteur->setSpacing(2);
        GridMoteur->setContentsMargins(1, 1, 1, 1);
        GridMoteur->setObjectName(QString::fromUtf8("GridMoteur"));
        label_11 = new QLabel(gBmoteur);
        label_11->setObjectName(QString::fromUtf8("label_11"));
        QSizePolicy sizePolicy(QSizePolicy::Preferred, QSizePolicy::Fixed);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(label_11->sizePolicy().hasHeightForWidth());
        label_11->setSizePolicy(sizePolicy);
        label_11->setAlignment(Qt::AlignCenter);

        GridMoteur->addWidget(label_11, 0, 0, 1, 1);

        label_10 = new QLabel(gBmoteur);
        label_10->setObjectName(QString::fromUtf8("label_10"));
        sizePolicy.setHeightForWidth(label_10->sizePolicy().hasHeightForWidth());
        label_10->setSizePolicy(sizePolicy);
        label_10->setAlignment(Qt::AlignCenter);

        GridMoteur->addWidget(label_10, 0, 1, 1, 1);


        horizontalLayout_4->addLayout(GridMoteur);

        Gmoteur = new QVBoxLayout();
        Gmoteur->setContentsMargins(1, 1, 1, 1);
        Gmoteur->setObjectName(QString::fromUtf8("Gmoteur"));
        verticalSpacer = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        Gmoteur->addItem(verticalSpacer);

        GraphMoteur = new QFrame(gBmoteur);
        GraphMoteur->setObjectName(QString::fromUtf8("GraphMoteur"));
        GraphMoteur->setMinimumSize(QSize(121, 121));
        GraphMoteur->setMaximumSize(QSize(121, 121));
        GraphMoteur->setFrameShape(QFrame::StyledPanel);
        GraphMoteur->setFrameShadow(QFrame::Raised);

        Gmoteur->addWidget(GraphMoteur);

        verticalSpacer_2 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        Gmoteur->addItem(verticalSpacer_2);


        horizontalLayout_4->addLayout(Gmoteur);


        gridLayout->addWidget(gBmoteur, 0, 2, 1, 1);

        Gpas = new QGroupBox(scrollAreaWidgetContents);
        Gpas->setObjectName(QString::fromUtf8("Gpas"));
        horizontalLayout_6 = new QHBoxLayout(Gpas);
        horizontalLayout_6->setContentsMargins(1, 1, 1, 1);
        horizontalLayout_6->setObjectName(QString::fromUtf8("horizontalLayout_6"));
        GridPas = new QGridLayout();
        GridPas->setSpacing(2);
        GridPas->setContentsMargins(1, 1, 1, 1);
        GridPas->setObjectName(QString::fromUtf8("GridPas"));
        label_12 = new QLabel(Gpas);
        label_12->setObjectName(QString::fromUtf8("label_12"));
        sizePolicy.setHeightForWidth(label_12->sizePolicy().hasHeightForWidth());
        label_12->setSizePolicy(sizePolicy);
        label_12->setAlignment(Qt::AlignCenter);

        GridPas->addWidget(label_12, 0, 0, 1, 1);

        label_13 = new QLabel(Gpas);
        label_13->setObjectName(QString::fromUtf8("label_13"));
        sizePolicy.setHeightForWidth(label_13->sizePolicy().hasHeightForWidth());
        label_13->setSizePolicy(sizePolicy);
        label_13->setAlignment(Qt::AlignCenter);

        GridPas->addWidget(label_13, 0, 1, 1, 1);


        horizontalLayout_6->addLayout(GridPas);

        verticalLayout_5 = new QVBoxLayout();
        verticalLayout_5->setContentsMargins(1, 1, 1, 1);
        verticalLayout_5->setObjectName(QString::fromUtf8("verticalLayout_5"));
        verticalSpacer_3 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_5->addItem(verticalSpacer_3);

        GraphPas = new QFrame(Gpas);
        GraphPas->setObjectName(QString::fromUtf8("GraphPas"));
        GraphPas->setMinimumSize(QSize(121, 121));
        GraphPas->setMaximumSize(QSize(121, 121));
        GraphPas->setFrameShape(QFrame::StyledPanel);
        GraphPas->setFrameShadow(QFrame::Raised);

        verticalLayout_5->addWidget(GraphPas);

        verticalSpacer_4 = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_5->addItem(verticalSpacer_4);


        horizontalLayout_6->addLayout(verticalLayout_5);


        gridLayout->addWidget(Gpas, 1, 2, 1, 1);

        gridLayout->setColumnStretch(0, 2);
        gridLayout->setColumnStretch(1, 3);
        gridLayout->setColumnStretch(2, 2);
        gridLayout->setColumnStretch(3, 2);
        gridLayout->setColumnStretch(4, 1);
        scrollArea->setWidget(scrollAreaWidgetContents);

        gridLayout_2->addWidget(scrollArea, 0, 0, 1, 1);

        MainWindow->setCentralWidget(centralwidget);
        menubar = new QMenuBar(MainWindow);
        menubar->setObjectName(QString::fromUtf8("menubar"));
        menubar->setGeometry(QRect(0, 0, 950, 24));
        menuFichier = new QMenu(menubar);
        menuFichier->setObjectName(QString::fromUtf8("menuFichier"));
        menuhelp = new QMenu(menubar);
        menuhelp->setObjectName(QString::fromUtf8("menuhelp"));
        MainWindow->setMenuBar(menubar);
        statusbar = new QStatusBar(MainWindow);
        statusbar->setObjectName(QString::fromUtf8("statusbar"));
        MainWindow->setStatusBar(statusbar);

        menubar->addAction(menuFichier->menuAction());
        menubar->addAction(menuhelp->menuAction());
        menuFichier->addAction(actionCharger);
        menuFichier->addAction(actionEnregistr);
        menuFichier->addAction(actionEnregistrerSous);
        menuFichier->addSeparator();
        menuFichier->addAction(actionImporter);
        menuFichier->addAction(actionExporter);
        menuhelp->addAction(actionA_propos);

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "Confiture", 0, QApplication::UnicodeUTF8));
        actionEnregistr->setText(QApplication::translate("MainWindow", "Enregistrer", 0, QApplication::UnicodeUTF8));
        actionCharger->setText(QApplication::translate("MainWindow", "Charger...", 0, QApplication::UnicodeUTF8));
        actionConfiguration->setText(QApplication::translate("MainWindow", "configuration", 0, QApplication::UnicodeUTF8));
        actionEnregistrerSous->setText(QApplication::translate("MainWindow", "Enregistrer sous...", 0, QApplication::UnicodeUTF8));
        actionImporter->setText(QApplication::translate("MainWindow", "Importer", 0, QApplication::UnicodeUTF8));
        actionExporter->setText(QApplication::translate("MainWindow", "Exporter", 0, QApplication::UnicodeUTF8));
        actionA_propos->setText(QApplication::translate("MainWindow", "\303\200 propos", 0, QApplication::UnicodeUTF8));
        Cannal->setTitle(QApplication::translate("MainWindow", "Cannal", 0, QApplication::UnicodeUTF8));
        DR->setTitle(QApplication::translate("MainWindow", "DR", 0, QApplication::UnicodeUTF8));
        Trime->setTitle(QApplication::translate("MainWindow", "Trim", 0, QApplication::UnicodeUTF8));
        Debatement->setTitle(QApplication::translate("MainWindow", "D\303\251battement", 0, QApplication::UnicodeUTF8));
        FinDeCourse->setTitle(QApplication::translate("MainWindow", "Fin de course", 0, QApplication::UnicodeUTF8));
        Inverseur->setTitle(QApplication::translate("MainWindow", "Inverseur", 0, QApplication::UnicodeUTF8));
        Mix->setTitle(QApplication::translate("MainWindow", "Mix", 0, QApplication::UnicodeUTF8));
        label->setText(QApplication::translate("MainWindow", "Type", 0, QApplication::UnicodeUTF8));
        label_2->setText(QApplication::translate("MainWindow", "Mode", 0, QApplication::UnicodeUTF8));
        label_3->setText(QApplication::translate("MainWindow", "Interrupteur A", 0, QApplication::UnicodeUTF8));
        label_4->setText(QApplication::translate("MainWindow", "Interrupteur B", 0, QApplication::UnicodeUTF8));
        label_5->setText(QApplication::translate("MainWindow", "WR A", 0, QApplication::UnicodeUTF8));
        label_6->setText(QApplication::translate("MainWindow", "WR B", 0, QApplication::UnicodeUTF8));
        label_7->setText(QApplication::translate("MainWindow", "Port s\303\251rie", 0, QApplication::UnicodeUTF8));
        CBPort->clear();
        CBPort->insertItems(0, QStringList()
         << QApplication::translate("MainWindow", "/dev/ttyUSB0", 0, QApplication::UnicodeUTF8)
         << QApplication::translate("MainWindow", "/dev/ttyUSB1", 0, QApplication::UnicodeUTF8)
         << QApplication::translate("MainWindow", "/dev/ttyUSB2", 0, QApplication::UnicodeUTF8)
         << QApplication::translate("MainWindow", "/dev/ttyUSB3", 0, QApplication::UnicodeUTF8)
         << QApplication::translate("MainWindow", "/dev/ttyUSB4", 0, QApplication::UnicodeUTF8)
         << QApplication::translate("MainWindow", "/dev/ttyS0", 0, QApplication::UnicodeUTF8)
         << QApplication::translate("MainWindow", "/dev/ttyS1", 0, QApplication::UnicodeUTF8)
         << QApplication::translate("MainWindow", "/dev/ttyS2", 0, QApplication::UnicodeUTF8)
        );
        Envoyer->setText(QApplication::translate("MainWindow", "Envoyer", 0, QApplication::UnicodeUTF8));
        label_8->setText(QApplication::translate("MainWindow", "Envoyer\n"
"toutes les", 0, QApplication::UnicodeUTF8));
        TimeEnvoyer->setDisplayFormat(QApplication::translate("MainWindow", "ss:zzz", 0, QApplication::UnicodeUTF8));
        label_9->setText(QApplication::translate("MainWindow", "sec", 0, QApplication::UnicodeUTF8));
        gBmoteur->setTitle(QApplication::translate("MainWindow", "Courbe moteur", 0, QApplication::UnicodeUTF8));
        label_11->setText(QApplication::translate("MainWindow", "NOR", 0, QApplication::UnicodeUTF8));
        label_10->setText(QApplication::translate("MainWindow", "ID", 0, QApplication::UnicodeUTF8));
        Gpas->setTitle(QApplication::translate("MainWindow", "Courbe pas", 0, QApplication::UnicodeUTF8));
        label_12->setText(QApplication::translate("MainWindow", "NOR", 0, QApplication::UnicodeUTF8));
        label_13->setText(QApplication::translate("MainWindow", "ID", 0, QApplication::UnicodeUTF8));
        menuFichier->setTitle(QApplication::translate("MainWindow", "Fichier", 0, QApplication::UnicodeUTF8));
        menuhelp->setTitle(QApplication::translate("MainWindow", "Help", 0, QApplication::UnicodeUTF8));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
