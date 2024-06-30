"use client";
import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const DailyProgress = () => {
  return (
    <>
      <div className="p-8 bg-black">
        <h1 className="mt-5 bg-gray-900 p-3 rounded-xl shadow-md shadow-gray-800 font-bold text-3xl text-center text-white ">
          Daily Progress
        </h1>

        <div className=" mt-8 flex justify-cetner gap-3 lg:flex-nowrap flex-wrap p-4">
          <Card className="p-4 bg-[#c4e9ff]">
            <Card className="p-4 bg-blue-600 ">
              <CardBody>
                <h1 className="font-bold text-center text-2xl text-white">
                  Things Done Today
                </h1>
                <hr className="border-t-2 border-white my-4 mt-4" />
                <div className="mt-4 gap-2 flex lg:flex-nowrap flex-wrap">
                  <Table aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>Started</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Tony Reichert</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Zoey Lang</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Jane Fisher</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>William Howard</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Table aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>Finished</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Tony Reichert</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Zoey Lang</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Jane Fisher</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>William Howard</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Card>
          <Card className="p-4 bg-[#fca4b3]">
            <Card className="p-4 bg-red-300 ">
              <CardBody>
                <h1 className="font-bold text-center text-2xl text-white">
                 Pending Things
                </h1>
                <hr className="border-t-2 border-white my-4 mt-4" />
                <div className="mt-4 gap-2 flex lg:flex-nowrap flex-wrap">
                  <Table aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>Total</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Tony Reichert</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Zoey Lang</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Jane Fisher</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>William Howard</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Table aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>Started</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Tony Reichert</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Zoey Lang</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Jane Fisher</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>William Howard</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Table aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>3 Days</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Tony Reichert</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Zoey Lang</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Jane Fisher</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>William Howard</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Card>
          <Card className="p-4 bg-[#d6ffe5]">
            <Card className="p-4 bg-green-300 ">
              <CardBody>
                <h1 className="font-bold text-center text-2xl text-white">
                  Upcoming Things 
                </h1>
                <hr className="border-t-2 border-white my-4 mt-4" />
                <div className="mt-4 gap-2 flex lg:flex-nowrap flex-wrap">
                  <Table aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>Started</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Tony Reichert</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Zoey Lang</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Jane Fisher</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>William Howard</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Table aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>Finished</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Tony Reichert</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Zoey Lang</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Jane Fisher</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>William Howard</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DailyProgress;
