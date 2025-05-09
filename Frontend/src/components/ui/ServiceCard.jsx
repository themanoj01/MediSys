import React from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Heart,
  Brain,
  Baby,
  Bone,
  Shield,
  ScanFace,
  Siren,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";

const getIcon = (iconName) => {
  switch (iconName) {
    case "Heart":
      return <Heart className="h-8 w-8 text-red-500" />;
    case "Brain":
      return <Brain className="h-8 w-8 text-purple-500" />;
    case "Baby":
      return <Baby className="h-8 w-8 text-blue-500" />;
    case "Bone":
      return <Bone className="h-8 w-8 text-amber-500" />;
    case "Shield":
      return <Shield className="h-8 w-8 text-green-500" />;
    case "Scan":
      return <ScanFace className="h-8 w-8 text-indigo-500" />;
    case "Siren":
      return <Siren className="h-8 w-8 text-red-500" />;
    default:
      return <AlertCircle className="h-8 w-8 text-gray-500" />;
  }
};

const ServiceCard = ({ icon, title, description, features, link }) => {
  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="mb-2">{getIcon(icon)}</div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          MediSys Hospital
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600">{description}</p>
        {features && features.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Key Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {link ? (
          <Link href={link}>
            <Button className="w-full" variant="outline">
              Learn More
            </Button>
          </Link>
        ) : (
          <Link href="/services">
            <Button className="w-full" variant="outline">
              Learn More
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
