const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm mb-2 font-Lato">
          © {new Date().getFullYear()} All rights reserved. This is a fictional
          project
          <span className="text-sm mb-2 font-semibold font-Lato ml-1">
            Created by <span className="text-">Ziad</span>
          </span>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
