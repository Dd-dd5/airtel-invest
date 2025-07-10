
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const About = () => {
  const benefits = [
    "Modern and responsive design",
    "Scalable architecture",
    "Expert development team",
    "24/7 customer support",
    "Regular updates and maintenance"
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              About Our Platform
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're dedicated to providing cutting-edge solutions that help businesses thrive in the digital age. 
              Our platform combines powerful features with intuitive design to deliver exceptional results.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            
            <Button size="lg">Learn More</Button>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"></div>
            <div className="absolute inset-4 bg-card border border-border rounded-xl shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
