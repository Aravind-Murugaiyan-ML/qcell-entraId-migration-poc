package mak.jhipster.doer.cucumber;

import io.cucumber.spring.CucumberContextConfiguration;
import mak.jhipster.doer.IntegrationTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@IntegrationTest
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
