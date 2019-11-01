import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);
const database_name = "hellodoctor.db";
const database_version = "1.0";
const database_displayname = "Report Database";
const database_size = 200000;

export default class Database {
    initDB() {
        let db;
        return new Promise((resolve) => {
            SQLite.echoTest()
                .then(() => {
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size
                    )
                        .then(DB => {
                            db = DB;
                            resolve(db);
                        })
                        .catch(error => {

                        });
                })
                .catch(error => {

                });
        });
    }


    createItemsTable() {
        return new Promise((resolve, reject) => {
            this.initDB().then((db) => {
                db.executeSql('SELECT 1 FROM ITEMS LIMIT 1').then(() => {
                    this.closeDatabase(db);
                    resolve('sucess');
                }).catch((error) => {
                    db.transaction((tx) => {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS ITEMS (itemId, itemName, itemDefault, itemRange)');
                    }).then(() => {
                        resolve('sucess');
                        this.closeDatabase(db);
                    }).catch(error => {
                        reject(err);
                        this.closeDatabase(db);
                    });
                });
            });
        })

    }

    createReportsTable() {
        return new Promise((resolve, reject) => {
            this.initDB().then((db) => {
                db.executeSql('SELECT 1 FROM ITEMS REPORTS 1').then(() => {
                    this.closeDatabase(db);
                    resolve('sucess');
                }).catch((error) => {
                    db.transaction((tx) => {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS REPORTS (reportId, reportName, patientName, age, sex, doctorName, items)');
                    }).then(() => {
                        this.closeDatabase(db);
                        resolve('sucess');
                    }).catch(error => {
                        reject(err);
                        this.closeDatabase(db);
                    });
                });
            });
        });
    }

    closeDatabase(db) {
        if (db) {
            db.close()
                .then(status => {

                })
                .catch(error => {
                    this.errorCB(error);
                });
        } else {

        }
    }

    listItems() {
        return new Promise((resolve) => {
            const products = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT itemId, itemName, itemRange, itemDefault FROM ITEMS', []).then(([tx, results]) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            const { itemId, itemName, itemDefault, itemRange } = row;
                            products.push({
                                itemId,
                                itemName,
                                itemDefault,
                                itemRange
                            });
                        }
                        resolve(products);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {

                });
            }).catch((err) => {

            });
        });
    }



    addItem(item) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO ITEMS VALUES (?, ?, ?, ?)', [item.itemId, item.itemName, item.itemDefault, item.itemRange]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {

                });
            }).catch((err) => {

            });
        });
    }

    updateItem(item) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE ITEMS SET itemName = ?, itemDefault =?, itemRange = ? where itemId = ?', [item.itemName, item.itemDefault, item.itemRange, item.itemId]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {

                });
            }).catch((err) => {

            });
        });
    }

    listReports() {
        return new Promise((resolve) => {
            const products = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT reportId, reportName, patientName, age, sex, doctorName, items FROM REPORTS', []).then(([tx, results]) => {
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            const { reportId, reportName, patientName, doctorName, age, sex } = row;
                            const items = JSON.parse(row.items);
                            products.push({
                                reportId,
                                reportName,
                                patientName,
                                doctorName,
                                age,
                                sex,
                                items
                            });
                        }
                        resolve(products);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {

                });
            }).catch((err) => {

            });
        });
    }

    addReport(item) {
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('INSERT INTO REPORTS VALUES (?, ?, ?, ?, ?, ?, ?)', [item.reportId, item.reportName, item.patientName, item.age, item.sex, item.doctorName, JSON.stringify(item.items)]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {

            });
        });
    }

    updateReport(item) {
        console.log(item);
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    const items = JSON.stringify(item.items);
                    tx.executeSql(`UPDATE REPORTS SET 'reportName'='${item.reportName}', 'patientName'='${item.patientName}', 'doctorName'='${item.doctorName}', 'age'='${item.age}', 'sex'='${item.sex}', 'items'='${items}' where reportId=${item.reportId}`).then(([tx, results]) => {
                        console.log("results", results);
                        resolve(results);
                    });
                }).then((result) => {
                    console.log("result", result);
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log("err", err);
                });
            }).catch((err) => {

            });
        });
    }
}