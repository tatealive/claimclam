import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Divider
} from '@heroui/react';

export function HeroUIDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Navbar */}
      <Navbar className="bg-white shadow-sm">
        <NavbarBrand>
          <p className="font-bold text-inherit">Receipt Management System</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/submit">
              Submit Receipt
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/dashboard">
              Review Dashboard
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 HeroUI Integration Complete!
          </h1>
          <p className="text-lg text-gray-600">
            Modern UI components are now available throughout the application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Demo Cards */}
          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">Submit Receipt</p>
                <p className="text-small text-default-500">Create new expense submission</p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <p>Submit new expense receipts with comprehensive validation and file attachments.</p>
              <Button color="primary" className="mt-4" href="/submit">
                Get Started
              </Button>
            </CardBody>
          </Card>

          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">Review Dashboard</p>
                <p className="text-small text-default-500">Manage submissions</p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <p>Advanced filtering, sorting, and bulk actions for receipt management.</p>
              <Button color="secondary" className="mt-4" href="/dashboard">
                View Dashboard
              </Button>
            </CardBody>
          </Card>

          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">Modern Components</p>
                <p className="text-small text-default-500">HeroUI powered</p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <p>Beautiful, accessible components with built-in dark mode support.</p>
              <Button color="success" className="mt-4" variant="bordered">
                Explore
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Demo Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button color="primary" size="lg">
            Primary Button
          </Button>
          <Button color="secondary" size="lg" variant="bordered">
            Secondary Button
          </Button>
          <Button color="success" size="lg" variant="flat">
            Success Button
          </Button>
        </div>
      </div>
    </div>
  );
}
