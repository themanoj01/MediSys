import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

const DoctorCard = ({
  id,
  name,
  specialization,
  ahpraNumber,
  experience,
  imageUrl,
  description,
}) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {specialization}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-500">
          {experience} years experience
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">
          {description ||
            `${name} is a specialist in ${specialization} with ${experience} years of experience providing excellent patient care.`}
        </p>
        <div className="mt-3">
          <p className="text-xs text-gray-500">AHPRA: {ahpraNumber}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/doctors/${id}`}>
          <Button className="w-full" variant="outline">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
